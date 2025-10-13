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
exports.UpdateCurrencySettingsDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class UpdateCurrencySettingsDto {
}
exports.UpdateCurrencySettingsDto = UpdateCurrencySettingsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'Курс доллара США (USD)', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateCurrencySettingsDto.prototype, "usdRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1.08, description: 'Курс евро (EUR)', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateCurrencySettingsDto.prototype, "eurRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 92.5, description: 'Курс российского рубля (RUB)', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateCurrencySettingsDto.prototype, "rubRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 450, description: 'Курс казахстанского тенге (KZT)', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateCurrencySettingsDto.prototype, "kztRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'USD', description: 'Базовая валюта по умолчанию', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCurrencySettingsDto.prototype, "defaultCurrency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2000, description: 'Часовая заработная плата (₸)', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateCurrencySettingsDto.prototype, "hourlyWage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 12, description: 'НДС (%)', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateCurrencySettingsDto.prototype, "vatRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 15, description: 'Административные расходы (%)', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateCurrencySettingsDto.prototype, "administrativeExpenses", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10, description: 'Плановые накопления (%)', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateCurrencySettingsDto.prototype, "plannedSavings", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10, description: 'Общепроизводственные расходы (%)', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateCurrencySettingsDto.prototype, "productionExpenses", void 0);
//# sourceMappingURL=update-currency-settings.dto.js.map