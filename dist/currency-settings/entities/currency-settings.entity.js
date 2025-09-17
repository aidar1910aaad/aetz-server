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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrencySettings = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
let CurrencySettings = class CurrencySettings {
};
exports.CurrencySettings = CurrencySettings;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'Уникальный идентификатор' }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], CurrencySettings.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'Курс доллара США (USD)' }),
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, default: 1 }),
    __metadata("design:type", Number)
], CurrencySettings.prototype, "usdRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1.08, description: 'Курс евро (EUR)' }),
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, default: 1.08 }),
    __metadata("design:type", Number)
], CurrencySettings.prototype, "eurRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 92.5, description: 'Курс российского рубля (RUB)' }),
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, default: 92.5 }),
    __metadata("design:type", Number)
], CurrencySettings.prototype, "rubRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 450, description: 'Курс казахстанского тенге (KZT)' }),
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, default: 450 }),
    __metadata("design:type", Number)
], CurrencySettings.prototype, "kztRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'USD', description: 'Базовая валюта по умолчанию' }),
    (0, typeorm_1.Column)({ default: 'USD' }),
    __metadata("design:type", String)
], CurrencySettings.prototype, "defaultCurrency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2000, description: 'Часовая заработная плата (₸)' }),
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, default: 2000 }),
    __metadata("design:type", Number)
], CurrencySettings.prototype, "hourlyWage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 12, description: 'НДС (%)' }),
    (0, typeorm_1.Column)('decimal', { precision: 5, scale: 2, default: 12 }),
    __metadata("design:type", Number)
], CurrencySettings.prototype, "vatRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 15, description: 'Административные расходы (%)' }),
    (0, typeorm_1.Column)('decimal', { precision: 5, scale: 2, default: 15 }),
    __metadata("design:type", Number)
], CurrencySettings.prototype, "administrativeExpenses", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10, description: 'Плановые накопления (%)' }),
    (0, typeorm_1.Column)('decimal', { precision: 5, scale: 2, default: 10 }),
    __metadata("design:type", Number)
], CurrencySettings.prototype, "plannedSavings", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10, description: 'Общепроизводственные расходы (%)' }),
    (0, typeorm_1.Column)('decimal', { precision: 5, scale: 2, default: 10 }),
    __metadata("design:type", Number)
], CurrencySettings.prototype, "productionExpenses", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-03-20T10:00:00Z', description: 'Дата создания' }),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], CurrencySettings.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-03-20T10:00:00Z', description: 'Дата последнего обновления' }),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], CurrencySettings.prototype, "updatedAt", void 0);
exports.CurrencySettings = CurrencySettings = __decorate([
    (0, typeorm_1.Entity)()
], CurrencySettings);
//# sourceMappingURL=currency-settings.entity.js.map