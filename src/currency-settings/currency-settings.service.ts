import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CurrencySettings } from './entities/currency-settings.entity';
import { UpdateCurrencySettingsDto } from './dto/update-currency-settings.dto';

@Injectable()
export class CurrencySettingsService {
    constructor(
        @InjectRepository(CurrencySettings)
        private readonly currencySettingsRepo: Repository<CurrencySettings>,
    ) {
        this.initializeSettings();
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

        // Обновляем только те поля, которые были переданы
        Object.keys(updateData).forEach(key => {
            if (updateData[key] !== undefined) {
                settings[key] = updateData[key];
            }
        });

        return this.currencySettingsRepo.save(settings);
    }
} 