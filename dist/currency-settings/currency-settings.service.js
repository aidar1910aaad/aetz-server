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
let CurrencySettingsService = class CurrencySettingsService {
    constructor(currencySettingsRepo) {
        this.currencySettingsRepo = currencySettingsRepo;
        this.initializeSettings();
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
        Object.keys(updateData).forEach(key => {
            if (updateData[key] !== undefined) {
                settings[key] = updateData[key];
            }
        });
        return this.currencySettingsRepo.save(settings);
    }
};
exports.CurrencySettingsService = CurrencySettingsService;
exports.CurrencySettingsService = CurrencySettingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(currency_settings_entity_1.CurrencySettings)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CurrencySettingsService);
//# sourceMappingURL=currency-settings.service.js.map