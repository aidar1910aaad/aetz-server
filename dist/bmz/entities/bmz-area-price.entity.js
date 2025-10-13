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
exports.BmzAreaPrice = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
let BmzAreaPrice = class BmzAreaPrice {
};
exports.BmzAreaPrice = BmzAreaPrice;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Уникальный идентификатор',
        example: 1
    }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], BmzAreaPrice.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Минимальная площадь (м²)',
        example: 0
    }),
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], BmzAreaPrice.prototype, "minArea", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Максимальная площадь (м²)',
        example: 100
    }),
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], BmzAreaPrice.prototype, "maxArea", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Минимальная толщина стен (мм)',
        example: 0
    }),
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], BmzAreaPrice.prototype, "minWallThickness", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Максимальная толщина стен (мм)',
        example: 80
    }),
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], BmzAreaPrice.prototype, "maxWallThickness", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Базовая цена за квадратный метр',
        example: 2000
    }),
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], BmzAreaPrice.prototype, "basePricePerSquareMeter", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Активен ли элемент',
        example: true
    }),
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], BmzAreaPrice.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Дата создания'
    }),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], BmzAreaPrice.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Дата обновления'
    }),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], BmzAreaPrice.prototype, "updatedAt", void 0);
exports.BmzAreaPrice = BmzAreaPrice = __decorate([
    (0, typeorm_1.Entity)('bmz_area_prices')
], BmzAreaPrice);
//# sourceMappingURL=bmz-area-price.entity.js.map