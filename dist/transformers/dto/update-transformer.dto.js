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
exports.UpdateTransformerDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class UpdateTransformerDto {
}
exports.UpdateTransformerDto = UpdateTransformerDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'ТСЛ-1250/20',
        description: 'Модель трансформатора (например: ТМГ-1000/10, ТСЛ-1250/20)'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateTransformerDto.prototype, "model", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '20',
        description: 'Номинальное напряжение (кВ). Примеры: 10, 20, 35, 110'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateTransformerDto.prototype, "voltage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'ТСЛ',
        description: 'Тип трансформатора. Примеры: ТМГ, ТСЛ, ТМЗ'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateTransformerDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 1250,
        description: 'Мощность трансформатора (кВА). Примеры: 25, 40, 63, 100, 160, 250, 400, 630, 1000, 1250, 1600, 2000, 2500, 3150, 4000'
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateTransformerDto.prototype, "power", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Alageum',
        description: 'Производитель трансформатора. Примеры: Alageum, ZBB'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateTransformerDto.prototype, "manufacturer", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 6996275,
        description: 'Цена трансформатора (тенге)'
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateTransformerDto.prototype, "price", void 0);
//# sourceMappingURL=update-transformer.dto.js.map