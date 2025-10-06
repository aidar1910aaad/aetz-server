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
exports.SwitchgearConfig = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
let SwitchgearConfig = class SwitchgearConfig {
};
exports.SwitchgearConfig = SwitchgearConfig;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1,
        description: 'Уникальный идентификатор конфигурации',
    }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], SwitchgearConfig.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'КСО 12-10',
        description: 'Тип ячейки РУ',
    }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SwitchgearConfig.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'AV-12 1250',
        description: 'Модель выключателя',
    }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SwitchgearConfig.prototype, "breaker", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 870,
        description: 'Номинальный ток в амперах',
    }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], SwitchgearConfig.prototype, "amperage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'АД',
        description: 'Группа ячеек',
    }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SwitchgearConfig.prototype, "group", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '60x6',
        description: 'Размер шины',
    }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SwitchgearConfig.prototype, "busbar", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: [
            { name: 'Ввод', quantity: 2 },
            { name: 'СВ', quantity: 1 },
            { name: 'ОТХ', quantity: 10 }
        ],
        description: 'Список ячеек с их количеством',
    }),
    (0, typeorm_1.Column)('jsonb'),
    __metadata("design:type", Array)
], SwitchgearConfig.prototype, "cells", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2024-03-10T12:00:00Z',
        description: 'Дата создания конфигурации',
    }),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], SwitchgearConfig.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2024-03-10T12:00:00Z',
        description: 'Дата последнего обновления конфигурации',
    }),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], SwitchgearConfig.prototype, "updatedAt", void 0);
exports.SwitchgearConfig = SwitchgearConfig = __decorate([
    (0, typeorm_1.Entity)('switchgear_configs')
], SwitchgearConfig);
//# sourceMappingURL=switchgear-config.entity.js.map