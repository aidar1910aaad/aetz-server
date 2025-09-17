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
exports.CalculationGroup = void 0;
const typeorm_1 = require("typeorm");
const calculation_entity_1 = require("./calculation.entity");
const swagger_1 = require("@nestjs/swagger");
let CalculationGroup = class CalculationGroup {
};
exports.CalculationGroup = CalculationGroup;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], CalculationGroup.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Камера КСО А12-10' }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CalculationGroup.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'kso-a12-10' }),
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], CalculationGroup.prototype, "slug", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 10,
        description: 'Тип вольтажа (например: 10, 20, 35 и т.д.)',
        required: false
    }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], CalculationGroup.prototype, "voltageType", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => calculation_entity_1.Calculation, (calc) => calc.group),
    __metadata("design:type", Array)
], CalculationGroup.prototype, "calculations", void 0);
exports.CalculationGroup = CalculationGroup = __decorate([
    (0, typeorm_1.Entity)()
], CalculationGroup);
//# sourceMappingURL=calculation-group.entity.js.map