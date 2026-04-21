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
const calculation_entity_1 = require("../calculations/entities/calculation.entity");
let CurrencySettingsService = class CurrencySettingsService {
    constructor(currencySettingsRepo, materialRepo, calculationRepo) {
        this.currencySettingsRepo = currencySettingsRepo;
        this.materialRepo = materialRepo;
        this.calculationRepo = calculationRepo;
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
            case 'CNY':
                return this.toNumber(settings.cnyRate) || 1;
            case 'KZT':
            default:
                return this.toNumber(settings.kztRate) || 1;
        }
    }
    convertToKzt(priceInCurrency, currency, settings) {
        const rate = this.getRateByCurrency(settings, currency);
        if (!rate) {
            return priceInCurrency;
        }
        return Number((priceInCurrency * rate).toFixed(2));
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
    updateCalculationDataByMaterials(data, pricesByMaterialId) {
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
    async syncCalculationsWithCurrentMaterialPrices() {
        const [materials, calculations] = await Promise.all([
            this.materialRepo.find(),
            this.calculationRepo.find(),
        ]);
        if (!materials.length || !calculations.length) {
            return;
        }
        const pricesByMaterialId = new Map(materials.map((material) => [material.id, this.toNumber(material.price)]));
        const updatedCalculations = [];
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
    async initializeSettings() {
        const count = await this.currencySettingsRepo.count();
        if (count === 0) {
            const mockSettings = new currency_settings_entity_1.CurrencySettings();
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
    async updateSettings(updateData) {
        const settings = await this.currencySettingsRepo.findOne({
            where: {},
            order: { id: 'DESC' }
        });
        if (!settings) {
            throw new Error('Настройки валют не найдены');
        }
        const rateFields = ['usdRate', 'eurRate', 'rubRate', 'kztRate', 'cnyRate'];
        const hasRateChanges = rateFields.some((field) => updateData[field] !== undefined);
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
};
exports.CurrencySettingsService = CurrencySettingsService;
exports.CurrencySettingsService = CurrencySettingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(currency_settings_entity_1.CurrencySettings)),
    __param(1, (0, typeorm_1.InjectRepository)(material_entity_1.Material)),
    __param(2, (0, typeorm_1.InjectRepository)(calculation_entity_1.Calculation)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], CurrencySettingsService);
//# sourceMappingURL=currency-settings.service.js.map