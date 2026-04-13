import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CurrencySettings } from './entities/currency-settings.entity';
import { UpdateCurrencySettingsDto } from './dto/update-currency-settings.dto';
import { Material } from '../materials/entities/material.entity';

@Injectable()
export class CurrencySettingsService {
    constructor(
        @InjectRepository(CurrencySettings)
        private readonly currencySettingsRepo: Repository<CurrencySettings>,
        @InjectRepository(Material)
        private readonly materialRepo: Repository<Material>,
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

    private async initializeSettings() {
        const count = await this.currencySettingsRepo.count();
        if (count === 0) {
            // Создаем тестовые данные
            const mockSettings = new CurrencySettings();
            mockSettings.usdRate = 1;
            mockSettings.eurRate = 1.08;
            mockSettings.rubRate = 92.5;
            mockSettings.kztRate = 450;
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

        const rateFields: Array<keyof UpdateCurrencySettingsDto> = ['usdRate', 'eurRate', 'rubRate', 'kztRate'];
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
        }

        return savedSettings;
    }
} 