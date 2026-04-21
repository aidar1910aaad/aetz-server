import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CurrencySettings } from './entities/currency-settings.entity';
import { UpdateCurrencySettingsDto } from './dto/update-currency-settings.dto';
import { Material } from '../materials/entities/material.entity';
import { Calculation } from '../calculations/entities/calculation.entity';

@Injectable()
export class CurrencySettingsService {
    constructor(
        @InjectRepository(CurrencySettings)
        private readonly currencySettingsRepo: Repository<CurrencySettings>,
        @InjectRepository(Material)
        private readonly materialRepo: Repository<Material>,
        @InjectRepository(Calculation)
        private readonly calculationRepo: Repository<Calculation>,
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

    private async recalculateMaterialsPriceInKzt(settings: CurrencySettings): Promise<void> {
        const materials = await this.materialRepo.find();
        if (!materials.length) {
            return;
        }

        const updatedMaterials = materials.map((material) => {
            const priceInCurrency = this.toNumber(material.priceInCurrency ?? material.price);
            material.price = this.convertToKzt(priceInCurrency, material.currency || 'KZT', settings);
            return material;
        });

        await this.materialRepo.save(updatedMaterials);
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

    private async syncCalculationsWithCurrentMaterialPrices(): Promise<void> {
        const [materials, calculations] = await Promise.all([
            this.materialRepo.find(),
            this.calculationRepo.find(),
        ]);

        if (!materials.length || !calculations.length) {
            return;
        }

        const pricesByMaterialId = new Map<number, number>(
            materials.map((material) => [material.id, this.toNumber(material.price)]),
        );

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

    async updateSettings(updateData: UpdateCurrencySettingsDto) {
        const settings = await this.currencySettingsRepo.findOne({
            where: {},
            order: { id: 'DESC' }
        });

        if (!settings) {
            throw new Error('Настройки валют не найдены');
        }

        const rateFields: Array<keyof UpdateCurrencySettingsDto> = ['usdRate', 'eurRate', 'rubRate', 'kztRate', 'cnyRate'];
        const hasRateChanges = rateFields.some((field) => updateData[field] !== undefined);

        // Обновляем только те поля, которые были переданы
        Object.keys(updateData).forEach(key => {
            if (updateData[key] !== undefined) {
                settings[key] = updateData[key];
            }
        });

        const savedSettings = await this.currencySettingsRepo.save(settings);

        if (hasRateChanges) {
            await this.recalculateMaterialsPriceInKzt(savedSettings);
            await this.syncCalculationsWithCurrentMaterialPrices();
        }

        return savedSettings;
    }
} 