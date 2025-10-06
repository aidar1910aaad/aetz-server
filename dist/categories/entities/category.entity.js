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
exports.Category = void 0;
const typeorm_1 = require("typeorm");
const material_entity_1 = require("../../materials/entities/material.entity");
const swagger_1 = require("@nestjs/swagger");
let Category = class Category {
};
exports.Category = Category;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1,
        description: 'Уникальный идентификатор категории',
        minimum: 1
    }),
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", Number)
], Category.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Электрооборудование',
        description: 'Название категории (уникальное)',
        minLength: 1,
        maxLength: 100
    }),
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Category.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'ELEC',
        description: 'Уникальный код категории',
        maxLength: 10
    }),
    (0, typeorm_1.Column)({ unique: true, nullable: true }),
    __metadata("design:type", String)
], Category.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Категория для электрооборудования и комплектующих',
        description: 'Подробное описание категории',
        maxLength: 500
    }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Category.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: () => [material_entity_1.Material],
        description: 'Список материалов в данной категории'
    }),
    (0, typeorm_1.OneToMany)(() => material_entity_1.Material, (material) => material.category),
    __metadata("design:type", Array)
], Category.prototype, "materials", void 0);
exports.Category = Category = __decorate([
    (0, typeorm_1.Entity)()
], Category);
//# sourceMappingURL=category.entity.js.map