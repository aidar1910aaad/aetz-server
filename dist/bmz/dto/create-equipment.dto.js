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
exports.CreateEquipmentDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const bmz_equipment_entity_1 = require("../entities/bmz-equipment.entity");
class CreateEquipmentDto {
}
exports.CreateEquipmentDto = CreateEquipmentDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Название оборудования',
        example: 'Утепление стен'
    }),
    __metadata("design:type", String)
], CreateEquipmentDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: `Тип цены:
- perSquareMeter: цена за квадратный метр (требуется pricePerSquareMeter)
- perHalfSquareMeter: цена за полквадратного метра (требуется pricePerSquareMeter)
- fixed: фиксированная цена (требуется fixedPrice)`,
        enum: bmz_equipment_entity_1.EquipmentPriceType,
        example: bmz_equipment_entity_1.EquipmentPriceType.PER_SQUARE_METER
    }),
    __metadata("design:type", String)
], CreateEquipmentDto.prototype, "priceType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Цена за квадратный метр. Обязательно для типов perSquareMeter и perHalfSquareMeter',
        example: 1000,
        required: false
    }),
    __metadata("design:type", Number)
], CreateEquipmentDto.prototype, "pricePerSquareMeter", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Фиксированная цена. Обязательно для типа fixed',
        example: 5000,
        required: false
    }),
    __metadata("design:type", Number)
], CreateEquipmentDto.prototype, "fixedPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Описание оборудования',
        example: 'Дополнительное утепление стен'
    }),
    __metadata("design:type", String)
], CreateEquipmentDto.prototype, "description", void 0);
//# sourceMappingURL=create-equipment.dto.js.map