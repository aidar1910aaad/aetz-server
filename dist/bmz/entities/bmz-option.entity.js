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
exports.BmzOption = exports.OptionType = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
var OptionType;
(function (OptionType) {
    OptionType["PER_SQUARE_METER"] = "perSquareMeter";
    OptionType["PER_HALF_SQUARE_METER"] = "perHalfSquareMeter";
    OptionType["FIXED"] = "fixed";
})(OptionType || (exports.OptionType = OptionType = {}));
let BmzOption = class BmzOption {
};
exports.BmzOption = BmzOption;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1,
        description: 'Уникальный идентификатор'
    }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], BmzOption.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Освещение',
        description: 'Название опции'
    }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], BmzOption.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'perSquareMeter',
        description: 'Тип расчета цены: perSquareMeter - за м², perHalfSquareMeter - за 0.5 м², fixed - фиксированная цена',
        enum: OptionType
    }),
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: OptionType
    }),
    __metadata("design:type", String)
], BmzOption.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 2500,
        description: 'Цена за квадратный метр (если тип perSquareMeter или perHalfSquareMeter)'
    }),
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], BmzOption.prototype, "pricePerSquareMeter", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 10000,
        description: 'Фиксированная цена (если тип fixed)'
    }),
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], BmzOption.prototype, "fixedPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Освещение помещения',
        description: 'Описание опции'
    }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], BmzOption.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: true,
        description: 'Активна ли опция'
    }),
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], BmzOption.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2024-03-20T10:00:00Z',
        description: 'Дата создания записи'
    }),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], BmzOption.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2024-03-20T10:00:00Z',
        description: 'Дата последнего обновления записи'
    }),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], BmzOption.prototype, "updatedAt", void 0);
exports.BmzOption = BmzOption = __decorate([
    (0, typeorm_1.Entity)()
], BmzOption);
//# sourceMappingURL=bmz-option.entity.js.map