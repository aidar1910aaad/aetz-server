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
exports.Transformer = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
let Transformer = class Transformer {
};
exports.Transformer = Transformer;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1,
        description: 'Уникальный идентификатор'
    }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Transformer.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'ТСЛ-1250/20',
        description: 'Модель трансформатора'
    }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Transformer.prototype, "model", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '20',
        description: 'Номинальное напряжение'
    }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Transformer.prototype, "voltage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'ТСЛ',
        description: 'Тип трансформатора'
    }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Transformer.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1250,
        description: 'Мощность трансформатора'
    }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Transformer.prototype, "power", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Alageum',
        description: 'Производитель'
    }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Transformer.prototype, "manufacturer", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 6996275,
        description: 'Цена трансформатора'
    }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Transformer.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2024-03-20T10:00:00Z',
        description: 'Дата создания записи'
    }),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Transformer.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2024-03-20T10:00:00Z',
        description: 'Дата последнего обновления записи'
    }),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Transformer.prototype, "updatedAt", void 0);
exports.Transformer = Transformer = __decorate([
    (0, typeorm_1.Entity)()
], Transformer);
//# sourceMappingURL=transformer.entity.js.map