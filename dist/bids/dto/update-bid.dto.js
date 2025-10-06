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
exports.UpdateBidDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class UpdateBidDto {
}
exports.UpdateBidDto = UpdateBidDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'БКТП',
        description: 'Тип заявки'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateBidDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '2025-09-17',
        description: 'Дата заявки'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateBidDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'фывафыва',
        description: 'Название клиента'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateBidDto.prototype, "client", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'укфыва',
        description: 'Номер задачи'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateBidDto.prototype, "taskNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 52899246.5920094,
        description: 'Общая сумма заявки'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateBidDto.prototype, "totalAmount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Информация о пользователе'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UpdateBidDto.prototype, "user", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Все данные заявки (гибкая структура)',
        example: {
            bmz: { buildingType: 'bmz', length: 5000, width: 6000 },
            transformer: { selected: {}, total: 19026000 },
            rusn: { cellConfigs: [], total: 0 },
            runn: { cellSummaries: [], total: 0 },
            additionalEquipment: { selected: {}, equipmentList: [], total: 0 },
            works: { selected: {}, worksList: [], total: 0 }
        }
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UpdateBidDto.prototype, "data", void 0);
//# sourceMappingURL=update-bid.dto.js.map