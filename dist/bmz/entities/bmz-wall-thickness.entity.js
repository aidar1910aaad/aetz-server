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
exports.BmzWallThickness = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
let BmzWallThickness = class BmzWallThickness {
};
exports.BmzWallThickness = BmzWallThickness;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1,
        description: 'Уникальный идентификатор'
    }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], BmzWallThickness.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 0,
        description: 'Минимальная толщина стены (мм)'
    }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], BmzWallThickness.prototype, "minThickness", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 80,
        description: 'Максимальная толщина стены (мм)'
    }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], BmzWallThickness.prototype, "maxThickness", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 2000,
        description: 'Дополнительная цена за квадратный метр'
    }),
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], BmzWallThickness.prototype, "pricePerSquareMeter", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: true,
        description: 'Активна ли настройка'
    }),
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], BmzWallThickness.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2024-03-20T10:00:00Z',
        description: 'Дата создания записи'
    }),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], BmzWallThickness.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2024-03-20T10:00:00Z',
        description: 'Дата последнего обновления записи'
    }),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], BmzWallThickness.prototype, "updatedAt", void 0);
exports.BmzWallThickness = BmzWallThickness = __decorate([
    (0, typeorm_1.Entity)()
], BmzWallThickness);
//# sourceMappingURL=bmz-wall-thickness.entity.js.map