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
exports.CreateAreaPriceDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class CreateAreaPriceDto {
}
exports.CreateAreaPriceDto = CreateAreaPriceDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Минимальная площадь (м²)',
        example: 0
    }),
    __metadata("design:type", Number)
], CreateAreaPriceDto.prototype, "minArea", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Максимальная площадь (м²)',
        example: 100
    }),
    __metadata("design:type", Number)
], CreateAreaPriceDto.prototype, "maxArea", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Минимальная толщина стен (мм)',
        example: 0
    }),
    __metadata("design:type", Number)
], CreateAreaPriceDto.prototype, "minWallThickness", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Максимальная толщина стен (мм)',
        example: 80
    }),
    __metadata("design:type", Number)
], CreateAreaPriceDto.prototype, "maxWallThickness", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Базовая цена за квадратный метр',
        example: 2000
    }),
    __metadata("design:type", Number)
], CreateAreaPriceDto.prototype, "basePricePerSquareMeter", void 0);
//# sourceMappingURL=create-area-price.dto.js.map