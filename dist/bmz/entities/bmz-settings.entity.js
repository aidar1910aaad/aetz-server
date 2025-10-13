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
exports.BmzSettings = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
let BmzSettings = class BmzSettings {
};
exports.BmzSettings = BmzSettings;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Уникальный идентификатор настроек',
        example: 1
    }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], BmzSettings.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Базовая цена за квадратный метр',
        example: 2000
    }),
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], BmzSettings.prototype, "basePricePerSquareMeter", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Диапазоны цен по площади и толщине стен',
        type: 'array',
        example: [
            {
                minArea: 0,
                maxArea: 50,
                minWallThickness: 0,
                maxWallThickness: 50,
                pricePerSquareMeter: 25000
            },
            {
                minArea: 50,
                maxArea: 100,
                minWallThickness: 0,
                maxWallThickness: 50,
                pricePerSquareMeter: 23000
            }
        ]
    }),
    (0, typeorm_1.Column)('jsonb', { default: [] }),
    __metadata("design:type", Array)
], BmzSettings.prototype, "areaPriceRanges", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Дополнительное оборудование',
        type: 'array',
        example: [
            {
                name: 'Утепление стен',
                priceType: 'perSquareMeter',
                pricePerSquareMeter: 1000,
                description: 'Дополнительное утепление стен'
            },
            {
                name: 'Вентиляция',
                priceType: 'fixed',
                fixedPrice: 5000,
                description: 'Система вентиляции'
            }
        ]
    }),
    (0, typeorm_1.Column)('jsonb', { default: [] }),
    __metadata("design:type", Array)
], BmzSettings.prototype, "equipment", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Активны ли настройки',
        example: true
    }),
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], BmzSettings.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Дата создания'
    }),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], BmzSettings.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Дата обновления'
    }),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], BmzSettings.prototype, "updatedAt", void 0);
exports.BmzSettings = BmzSettings = __decorate([
    (0, typeorm_1.Entity)('bmz_settings')
], BmzSettings);
//# sourceMappingURL=bmz-settings.entity.js.map