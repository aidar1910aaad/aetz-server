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
var CurrencySettingsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrencySettingsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const currency_settings_entity_1 = require("./entities/currency-settings.entity");
const material_entity_1 = require("../materials/entities/material.entity");
const calculation_entity_1 = require("../calculations/entities/calculation.entity");
const audit_logs_service_1 = require("../audit-logs/audit-logs.service");
let CurrencySettingsService = CurrencySettingsService_1 = class CurrencySettingsService {
    constructor(currencySettingsRepo, materialRepo, calculationRepo, auditLogsService) {
        this.currencySettingsRepo = currencySettingsRepo;
        this.materialRepo = materialRepo;
        this.calculationRepo = calculationRepo;
        this.auditLogsService = auditLogsService;
        this.logger = new common_1.Logger(CurrencySettingsService_1.name);
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
    async recalculateMaterialsPriceInKzt(settings, affectedCurrencies) {
        this.logger.log('Recalculate materials in KZT: start');
        const normalizedCurrencies = affectedCurrencies.map((currency) => currency.toUpperCase());
        const materials = await this.materialRepo.find();
        const targetMaterials = materials.filter((material) => normalizedCurrencies.includes((material.currency || 'KZT').toUpperCase()));
        this.logger.log(`Recalculate materials in KZT: affected currencies [${normalizedCurrencies.join(', ')}]`);
        if (!targetMaterials.length) {
            this.logger.log('Recalculate materials in KZT: no materials for affected currencies');
            return new Map();
        }
        if (!materials.length) {
            this.logger.log('Recalculate materials in KZT: no materials');
            return new Map();
        }
        const changedPricesByMaterialId = new Map();
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
    async syncCalculationsWithCurrentMaterialPrices(pricesByMaterialId) {
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
        this.logger.log(`Sync calculations with material prices: done (${updatedCalculations.length}/${calculations.length} updated)`);
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
    async updateSettings(updateData, changedBy) {
        const updateStartedAt = Date.now();
        this.logger.log(`Update currency settings: start by ${changedBy || 'unknown'}`);
        const settings = await this.currencySettingsRepo.findOne({
            where: {},
            order: { id: 'DESC' }
        });
        if (!settings) {
            throw new Error('Настройки валют не найдены');
        }
        const rateFields = ['usdRate', 'eurRate', 'rubRate', 'kztRate', 'cnyRate'];
        const rateFieldToCurrency = {
            usdRate: 'USD',
            eurRate: 'EUR',
            rubRate: 'RUB',
            kztRate: 'KZT',
            cnyRate: 'CNY',
        };
        const changedEntries = [];
        const isSameValue = (oldValue, newValue) => {
            const oldNum = this.toNumber(oldValue);
            const newNum = this.toNumber(newValue);
            const isOldNumeric = typeof oldValue === 'number' || (typeof oldValue === 'string' && oldValue.trim() !== '' && !Number.isNaN(Number(oldValue)));
            const isNewNumeric = typeof newValue === 'number' || (typeof newValue === 'string' && newValue.trim() !== '' && !Number.isNaN(Number(newValue)));
            if (isOldNumeric && isNewNumeric) {
                return oldNum === newNum;
            }
            return String(oldValue ?? '') === String(newValue ?? '');
        };
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
            .filter((entry) => rateFields.includes(entry.key))
            .filter((entry) => this.toNumber(entry.oldValue) !== this.toNumber(entry.newValue))
            .map((entry) => entry.key);
        const hasRateChanges = changedRateFields.length > 0;
        const affectedCurrencies = changedRateFields
            .map((field) => rateFieldToCurrency[field])
            .filter((value) => Boolean(value));
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
};
exports.CurrencySettingsService = CurrencySettingsService;
exports.CurrencySettingsService = CurrencySettingsService = CurrencySettingsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(currency_settings_entity_1.CurrencySettings)),
    __param(1, (0, typeorm_1.InjectRepository)(material_entity_1.Material)),
    __param(2, (0, typeorm_1.InjectRepository)(calculation_entity_1.Calculation)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        audit_logs_service_1.AuditLogsService])
], CurrencySettingsService);
//# sourceMappingURL=currency-settings.service.js.map