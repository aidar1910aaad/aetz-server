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
exports.CreateSwitchgearConfigDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class CellDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Ввод',
        description: 'Название ячейки (например: Ввод, СВ, ОТХ)',
        minLength: 1,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CellDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 2,
        description: 'Количество ячеек данного типа',
        minimum: 1,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CellDto.prototype, "quantity", void 0);
class CreateSwitchgearConfigDto {
}
exports.CreateSwitchgearConfigDto = CreateSwitchgearConfigDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'КСО 12-10',
        description: 'Тип ячейки РУ (например: КСО 12-10, КМ)',
        minLength: 1,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateSwitchgearConfigDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'AV-12 1250',
        description: 'Модель выключателя',
        minLength: 1,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateSwitchgearConfigDto.prototype, "breaker", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 870,
        description: 'Номинальный ток в амперах',
        minimum: 1,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateSwitchgearConfigDto.prototype, "amperage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'АД',
        description: 'Группа ячеек (например: АД - асинхронные двигатели)',
        minLength: 1,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateSwitchgearConfigDto.prototype, "group", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '60x6',
        description: 'Размер шины (например: 60x6)',
        minLength: 1,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateSwitchgearConfigDto.prototype, "busbar", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [CellDto],
        description: 'Список ячеек с их количеством',
        example: [
            { name: 'Ввод', quantity: 2 },
            { name: 'СВ', quantity: 1 },
            { name: 'ОТХ', quantity: 10 }
        ],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CellDto),
    __metadata("design:type", Array)
], CreateSwitchgearConfigDto.prototype, "cells", void 0);
//# sourceMappingURL=create-switchgear-config.dto.js.map