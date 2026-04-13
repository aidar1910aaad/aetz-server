"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrencySettingsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const currency_settings_entity_1 = require("./entities/currency-settings.entity");
const material_entity_1 = require("../materials/entities/material.entity");
let CurrencySettingsService = class CurrencySettingsService {
    constructor(currencySettingsRepo, materialRepo) {
        this.currencySettingsRepo = currencySettingsRepo;
        this.materialRepo = materialRepo;
        this.initializeSettings();
    }
    toNumber(value) {
        if (typeof value === 'number')
            return value;
        if (typeof value === 'string') {
            const parsed = Number(value);
            return Number.isFinite(parsed) ? parsed : 0;
        }
        return 0;
    }
    getRateByCurrency(settings, currency) {
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
    convertToKzt(priceInCurrency, currency, settings) {
        const sourceRate = this.getRateByCurrency(settings, currency);
        const kztRate = this.getRateByCurrency(settings, 'KZT');
        if (!sourceRate || !kztRate) {
            return priceInCurrency;
        }
        return Number(((priceInCurrency / sourceRate) * kztRate).toFixed(2));
    }
    async recalculateMaterialsPriceInKzt(settings) {
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
    async initializeSettings() {
        const count = await this.currencySettingsRepo.count();
        if (count === 0) {
            const mockSettings = new currency_settings_entity_1.CurrencySettings();
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
    async updateSettings(updateData) {
        const settings = await this.currencySettingsRepo.findOne({
            where: {},
            order: { id: 'DESC' }
        });
        if (!settings) {
            throw new Error('Настройки валют не найдены');
        }
        const rateFields = ['usdRate', 'eurRate', 'rubRate', 'kztRate'];
        const hasRateChanges = rateFields.some((field) => updateData[field] !== undefined);
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
};
exports.CurrencySettingsService = CurrencySettingsService;
exports.CurrencySettingsService = CurrencySettingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(currency_settings_entity_1.CurrencySettings)),
    __param(1, (0, typeorm_1.InjectRepository)(material_entity_1.Material)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], CurrencySettingsService);
//# sourceMappingURL=currency-settings.service.js.map