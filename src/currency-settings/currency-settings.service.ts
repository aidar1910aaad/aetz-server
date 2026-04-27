import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CurrencySettings } from './entities/currency-settings.entity';
import { UpdateCurrencySettingsDto } from './dto/update-currency-settings.dto';
import { Material } from '../materials/entities/material.entity';
import { Calculation } from '../calculations/entities/calculation.entity';
import { AuditLogsService } from '../audit-logs/audit-logs.service';

@Injectable()
export class CurrencySettingsService {
    private readonly logger = new Logger(CurrencySettingsService.name);

    constructor(
        @InjectRepository(CurrencySettings)
        private readonly currencySettingsRepo: Repository<CurrencySettings>,
        @InjectRepository(Material)
        private readonly materialRepo: Repository<Material>,
        @InjectRepository(Calculation)
        private readonly calculationRepo: Repository<Calculation>,
        private readonly auditLogsService: AuditLogsService,
    ) {
        this.initializeSettings();
    }

    private toNumber(value: unknown): number {
        if (typeof value === 'number') return value;
        if (typeof value === 'string') {
            const parsed = Number(value);
            return Number.isFinite(parsed) ? parsed : 0;
        }
        return 0;
    }

    private getRateByCurrency(settings: CurrencySettings, currency: string): number {
        switch ((currency || 'KZT').toUpperCase()) {
            case 'USD':
                return this.toNumber(settings.usdRate) || 1;
            case 'EUR':
                return this.toNumber(settings.eurRate) || 1;
            case 'RUB':
                return this.toNumber(settings.rubRate) || 1;
            case 'CNY':
                return this.toNumber(settings.cnyRate) || 1;
            case 'KZT':
            default:
                return this.toNumber(settings.kztRate) || 1;
        }
    }

    private convertToKzt(priceInCurrency: number, currency: string, settings: CurrencySettings): number {
        const rate = this.getRateByCurrency(settings, currency);

        if (!rate) {
            return priceInCurrency;
        }

        return Number((priceInCurrency * rate).toFixed(2));
    }

    private async recalculateMaterialsPriceInKzt(settings: CurrencySettings, affectedCurrencies: string[]): Promise<Map<number, number>> {
        this.logger.log('Recalculate materials in KZT: start');
        const normalizedCurrencies = affectedCurrencies.map((currency) => currency.toUpperCase());
        const materials = await this.materialRepo.find();
        const targetMaterials = materials.filter((material) =>
            normalizedCurrencies.includes((material.currency || 'KZT').toUpperCase()),
        );

        this.logger.log(`Recalculate materials in KZT: affected currencies [${normalizedCurrencies.join(', ')}]`);

        if (!targetMaterials.length) {
            this.logger.log('Recalculate materials in KZT: no materials for affected currencies');
            return new Map<number, number>();
        }

        if (!materials.length) {
            this.logger.log('Recalculate materials in KZT: no materials');
            return new Map<number, number>();
        }

        const changedPricesByMaterialId = new Map<number, number>();
        const updatedMaterials = targetMaterials.map((material) => {
            const priceInCurrency = this.toNumber(material.priceInCurrency ?? material.price);
            const nextPrice = this.convertToKzt(priceInCurrency, material.currency || 'KZT', settings);
            if (this.toNumber(material.price) !== nextPrice) {
                changedPricesByMaterialId.set(material.id, nextPrice);
            }
            material.price = nextPrice;
            return material;
        });

        const batchSize = 200;
        for (let i = 0; i < updatedMaterials.length; i += batchSize) {
            const batch = updatedMaterials.slice(i, i + batchSize);
            await this.materialRepo.save(batch);
            this.logger.log(`Recalculate materials in KZT: saved ${Math.min(i + batch.length, updatedMaterials.length)}/${updatedMaterials.length}`);
        }
        this.logger.log(`Recalculate materials in KZT: done (${updatedMaterials.length} materials, ${changedPricesByMaterialId.size} changed)`);
        return changedPricesByMaterialId;
    }

    private updateCalculationDataByMaterials(data: any, pricesByMaterialId: Map<number, number>): any {
        if (!data || typeof data !== 'object') {
            return data;
        }

        const nextData = { ...data };

        if (Array.isArray(nextData.categories)) {
            nextData.categories = nextData.categories.map((category) => {
                if (!Array.isArray(category?.items)) {
                    return category;
                }

                return {
                    ...category,
                    items: category.items.map((item) => {
                        if (item?.id && pricesByMaterialId.has(item.id)) {
                            return { ...item, price: pricesByMaterialId.get(item.id) };
                        }
                        return item;
                    }),
                };
            });
        }

        if (nextData.cellConfig?.materials && typeof nextData.cellConfig.materials === 'object') {
            const materials = { ...nextData.cellConfig.materials };
            Object.keys(materials).forEach((key) => {
                const value = materials[key];
                if (Array.isArray(value)) {
                    materials[key] = value.map((item) => {
                        if (item?.id && pricesByMaterialId.has(item.id)) {
                            return { ...item, price: pricesByMaterialId.get(item.id) };
                        }
                        return item;
                    });
                    return;
                }

                if (value?.id && pricesByMaterialId.has(value.id)) {
                    materials[key] = { ...value, price: pricesByMaterialId.get(value.id) };
                }
            });

            nextData.cellConfig = {
                ...nextData.cellConfig,
                materials,
            };
        }

        return nextData;
    }

    private async syncCalculationsWithCurrentMaterialPrices(pricesByMaterialId: Map<number, number>): Promise<void> {
        this.logger.log('Sync calculations with material prices: start');
        if (pricesByMaterialId.size === 0) {
            this.logger.log('Sync calculations: skipped (no changed material prices)');
            return;
        }

        const calculations = await this.calculationRepo.find();

        if (!calculations.length) {
            this.logger.log('Sync calculations: skipped (no calculations)');
            return;
        }

        const updatedCalculations: Calculation[] = [];
        calculations.forEach((calculation) => {
            const updatedData = this.updateCalculationDataByMaterials(calculation.data, pricesByMaterialId);
            if (JSON.stringify(updatedData) !== JSON.stringify(calculation.data)) {
                calculation.data = updatedData;
                updatedCalculations.push(calculation);
            }
        });

        if (updatedCalculations.length > 0) {
            await this.calculationRepo.save(updatedCalculations);
        }
        this.logger.log(`Sync calculations with material prices: done (${updatedCalculations.length}/${calculations.length} updated)`);
    }

    private async initializeSettings() {
        const count = await this.currencySettingsRepo.count();
        if (count === 0) {
            // Создаем тестовые данные
            const mockSettings = new CurrencySettings();
            mockSettings.usdRate = 1;
            mockSettings.eurRate = 1.08;
            mockSettings.rubRate = 92.5;
            mockSettings.kztRate = 450;
            mockSettings.cnyRate = 62.3;
            mockSettings.defaultCurrency = 'USD';
            await this.currencySettingsRepo.save(mockSettings);
        }
    }

    async getSettings() {
        const settings = await this.currencySettingsRepo.findOne({
            where: {},
            order: { id: 'DESC' }
        });

        if (!settings) {
            throw new Error('Настройки валют не найдены');
        }

        return settings;
    }

    async updateSettings(updateData: UpdateCurrencySettingsDto, changedBy?: string) {
        const updateStartedAt = Date.now();
        this.logger.log(`Update currency settings: start by ${changedBy || 'unknown'}`);
        const settings = await this.currencySettingsRepo.findOne({
            where: {},
            order: { id: 'DESC' }
        });

        if (!settings) {
            throw new Error('Настройки валют не найдены');
        }

        const rateFields: Array<keyof UpdateCurrencySettingsDto> = ['usdRate', 'eurRate', 'rubRate', 'kztRate', 'cnyRate'];
        const rateFieldToCurrency: Partial<Record<keyof UpdateCurrencySettingsDto, string>> = {
            usdRate: 'USD',
            eurRate: 'EUR',
            rubRate: 'RUB',
            kztRate: 'KZT',
            cnyRate: 'CNY',
        };

        const changedEntries: Array<{ key: string; oldValue: unknown; newValue: unknown }> = [];
        const isSameValue = (oldValue: unknown, newValue: unknown): boolean => {
            const oldNum = this.toNumber(oldValue);
            const newNum = this.toNumber(newValue);
            const isOldNumeric = typeof oldValue === 'number' || (typeof oldValue === 'string' && oldValue.trim() !== '' && !Number.isNaN(Number(oldValue)));
            const isNewNumeric = typeof newValue === 'number' || (typeof newValue === 'string' && newValue.trim() !== '' && !Number.isNaN(Number(newValue)));
            if (isOldNumeric && isNewNumeric) {
                return oldNum === newNum;
            }

            return String(oldValue ?? '') === String(newValue ?? '');
        };

        // Обновляем только реально изменившиеся поля
        Object.keys(updateData).forEach(key => {
            if (updateData[key] !== undefined) {
                if (isSameValue(settings[key], updateData[key])) {
                    return;
                }
                changedEntries.push({
                    key,
                    oldValue: settings[key],
                    newValue: updateData[key],
                });
                settings[key] = updateData[key];
            }
        });

        const changedRateFields = changedEntries
            .filter((entry) => rateFields.includes(entry.key as keyof UpdateCurrencySettingsDto))
            .filter((entry) => this.toNumber(entry.oldValue) !== this.toNumber(entry.newValue))
            .map((entry) => entry.key as keyof UpdateCurrencySettingsDto);
        const hasRateChanges = changedRateFields.length > 0;
        const affectedCurrencies = changedRateFields
            .map((field) => rateFieldToCurrency[field])
            .filter((value): value is string => Boolean(value));

        const savedSettings = changedEntries.length > 0
            ? await this.currencySettingsRepo.save(settings)
            : settings;
        this.logger.log(`Update currency settings: saved. Rate changes: ${hasRateChanges ? 'yes' : 'no'}`);

        if (hasRateChanges) {
            const changedPricesByMaterialId = await this.recalculateMaterialsPriceInKzt(savedSettings, affectedCurrencies);
            await this.syncCalculationsWithCurrentMaterialPrices(changedPricesByMaterialId);
        }

        for (const entry of changedEntries) {
            await this.auditLogsService.log({
                entityType: 'currency_settings',
                entityId: savedSettings.id,
                action: 'UPDATE',
                fieldChanged: entry.key,
                oldValue: entry.oldValue,
                newValue: entry.newValue,
                changedBy: changedBy || 'Неизвестный пользователь',
            });
        }

        const elapsedMs = Date.now() - updateStartedAt;
        this.logger.log(`Update currency settings: done in ${elapsedMs}ms (${changedEntries.length} changed fields)`);

        return savedSettings;
    }
} 