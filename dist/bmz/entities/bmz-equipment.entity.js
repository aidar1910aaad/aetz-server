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
exports.BmzEquipment = exports.EquipmentPriceType = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
var EquipmentPriceType;
(function (EquipmentPriceType) {
    EquipmentPriceType["PER_SQUARE_METER"] = "perSquareMeter";
    EquipmentPriceType["PER_HALF_SQUARE_METER"] = "perHalfSquareMeter";
    EquipmentPriceType["FIXED"] = "fixed";
})(EquipmentPriceType || (exports.EquipmentPriceType = EquipmentPriceType = {}));
let BmzEquipment = class BmzEquipment {
};
exports.BmzEquipment = BmzEquipment;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Уникальный идентификатор',
        example: 1
    }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], BmzEquipment.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Название оборудования',
        example: 'Утепление стен'
    }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], BmzEquipment.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: `Тип цены:
- perSquareMeter: цена за квадратный метр (требуется pricePerSquareMeter)
- perHalfSquareMeter: цена за полквадратного метра (требуется pricePerSquareMeter)
- fixed: фиксированная цена (требуется fixedPrice)`,
        enum: EquipmentPriceType,
        example: EquipmentPriceType.PER_SQUARE_METER
    }),
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: EquipmentPriceType,
        default: EquipmentPriceType.PER_SQUARE_METER
    }),
    __metadata("design:type", String)
], BmzEquipment.prototype, "priceType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Цена за квадратный метр. Обязательно для типов perSquareMeter и perHalfSquareMeter',
        example: 1000,
        required: false
    }),
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], BmzEquipment.prototype, "pricePerSquareMeter", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Фиксированная цена. Обязательно для типа fixed',
        example: 5000,
        required: false
    }),
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], BmzEquipment.prototype, "fixedPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Описание оборудования',
        example: 'Дополнительное утепление стен'
    }),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], BmzEquipment.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Активен ли элемент',
        example: true
    }),
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], BmzEquipment.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Дата создания'
    }),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], BmzEquipment.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Дата обновления'
    }),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], BmzEquipment.prototype, "updatedAt", void 0);
exports.BmzEquipment = BmzEquipment = __decorate([
    (0, typeorm_1.Entity)('bmz_equipment')
], BmzEquipment);
//# sourceMappingURL=bmz-equipment.entity.js.map