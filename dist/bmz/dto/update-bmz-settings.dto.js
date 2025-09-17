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
exports.UpdateBmzSettingsDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class AreaPriceRangeDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 0, description: 'Минимальная площадь (м²)' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], AreaPriceRangeDto.prototype, "minArea", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 50, description: 'Максимальная площадь (м²)' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], AreaPriceRangeDto.prototype, "maxArea", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 0, description: 'Минимальная толщина стен (мм)' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], AreaPriceRangeDto.prototype, "minWallThickness", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 50, description: 'Максимальная толщина стен (мм)' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], AreaPriceRangeDto.prototype, "maxWallThickness", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 25000, description: 'Цена за квадратный метр' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], AreaPriceRangeDto.prototype, "pricePerSquareMeter", void 0);
class EquipmentDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Утепление стен', description: 'Название оборудования' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EquipmentDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'perSquareMeter',
        description: 'Тип цены: perSquareMeter, perHalfSquareMeter или fixed',
        enum: ['perSquareMeter', 'perHalfSquareMeter', 'fixed']
    }),
    (0, class_validator_1.IsEnum)(['perSquareMeter', 'perHalfSquareMeter', 'fixed']),
    __metadata("design:type", String)
], EquipmentDto.prototype, "priceType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1000,
        description: 'Цена за квадратный метр (для типов perSquareMeter и perHalfSquareMeter)',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], EquipmentDto.prototype, "pricePerSquareMeter", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 5000,
        description: 'Фиксированная цена (для типа fixed)',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], EquipmentDto.prototype, "fixedPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Дополнительное утепление стен', description: 'Описание оборудования' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EquipmentDto.prototype, "description", void 0);
class UpdateBmzSettingsDto {
}
exports.UpdateBmzSettingsDto = UpdateBmzSettingsDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 25000,
        description: 'Базовая цена за квадратный метр'
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateBmzSettingsDto.prototype, "basePricePerSquareMeter", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Диапазоны цен по площади и толщине стен',
        type: [AreaPriceRangeDto]
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => AreaPriceRangeDto),
    __metadata("design:type", Array)
], UpdateBmzSettingsDto.prototype, "areaPriceRanges", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Дополнительное оборудование',
        type: [EquipmentDto]
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => EquipmentDto),
    __metadata("design:type", Array)
], UpdateBmzSettingsDto.prototype, "equipment", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: true,
        description: 'Активны ли настройки'
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateBmzSettingsDto.prototype, "isActive", void 0);
//# sourceMappingURL=update-bmz-settings.dto.js.map