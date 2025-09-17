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
exports.Calculation = void 0;
const typeorm_1 = require("typeorm");
const calculation_group_entity_1 = require("./calculation-group.entity");
const swagger_1 = require("@nestjs/swagger");
let Calculation = class Calculation {
};
exports.Calculation = Calculation;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Calculation.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Камера КСО А12-10 900×1000' }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Calculation.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '900x1000' }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Calculation.prototype, "slug", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => calculation_group_entity_1.CalculationGroup, (group) => group.calculations, { onDelete: 'CASCADE' }),
    __metadata("design:type", calculation_group_entity_1.CalculationGroup)
], Calculation.prototype, "group", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: { materials: [], total: 0 } }),
    (0, typeorm_1.Column)('json'),
    __metadata("design:type", Object)
], Calculation.prototype, "data", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Calculation.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Calculation.prototype, "updatedAt", void 0);
exports.Calculation = Calculation = __decorate([
    (0, typeorm_1.Entity)()
], Calculation);
//# sourceMappingURL=calculation.entity.js.map