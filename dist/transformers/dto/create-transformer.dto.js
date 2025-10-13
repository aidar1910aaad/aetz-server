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
exports.CreateTransformerDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateTransformerDto {
}
exports.CreateTransformerDto = CreateTransformerDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'ТСЛ-1250/20', description: 'Модель трансформатора' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateTransformerDto.prototype, "model", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '20', description: 'Номинальное напряжение' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateTransformerDto.prototype, "voltage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'ТСЛ', description: 'Тип трансформатора' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateTransformerDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1250, description: 'Мощность трансформатора' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateTransformerDto.prototype, "power", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Alageum', description: 'Производитель' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateTransformerDto.prototype, "manufacturer", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 6996275, description: 'Цена трансформатора' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateTransformerDto.prototype, "price", void 0);
//# sourceMappingURL=create-transformer.dto.js.map