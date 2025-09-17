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
exports.CreateCalculationGroupDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateCalculationGroupDto {
}
exports.CreateCalculationGroupDto = CreateCalculationGroupDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Камера КСО А12-10',
        description: 'Название группы (slug будет сгенерирован автоматически)'
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCalculationGroupDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 10,
        description: 'Тип вольтажа (например: 10, 20, 35 и т.д.)',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateCalculationGroupDto.prototype, "voltageType", void 0);
//# sourceMappingURL=create-calculation-group.dto.js.map