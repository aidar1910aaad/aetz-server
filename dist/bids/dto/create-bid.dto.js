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
exports.CreateBidDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class UserDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 4, description: 'ID пользователя' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UserDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'aidarr', description: 'Имя пользователя' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UserDto.prototype, "username", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Айдар', description: 'Имя' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UserDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Айдарович', description: 'Фамилия' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UserDto.prototype, "lastName", void 0);
class CreateBidDto {
}
exports.CreateBidDto = CreateBidDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'БКТП',
        description: 'Тип заявки'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateBidDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2025-09-17',
        description: 'Дата заявки'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateBidDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'фывафыва',
        description: 'Название клиента'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateBidDto.prototype, "client", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'укфыва',
        description: 'Номер задачи'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateBidDto.prototype, "taskNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 52899246.5920094,
        description: 'Общая сумма заявки'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateBidDto.prototype, "totalAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Информация о пользователе',
        type: UserDto
    }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Type)(() => UserDto),
    __metadata("design:type", UserDto)
], CreateBidDto.prototype, "user", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Все данные заявки (гибкая структура)',
        example: {
            bmz: {
                buildingType: 'bmz',
                length: 5000,
                width: 6000,
                height: 3000,
                thickness: 100,
                total: 1500000
            },
            transformer: {
                selected: { id: 1, model: 'ТСЛ-1250/20', price: 19026000 },
                total: 19026000
            },
            rusn: {
                cellConfigs: [
                    { type: '0.4kv', materials: { switch: { id: 1, name: 'Выключатель', price: 50000 } } }
                ],
                busbarSummary: { total: 100000 },
                total: 150000
            },
            runn: {
                cellSummaries: [
                    { type: '10kv', quantity: 2, total: 500000 }
                ],
                total: 9088368.92
            },
            additionalEquipment: {
                selected: { id: 1, name: 'Вентиляция' },
                equipmentList: [
                    { id: 1, name: 'Вентиляция', price: 50000 },
                    { id: 2, name: 'Утепление', price: 30000 }
                ],
                total: 80000
            },
            works: {
                selected: { id: 1, name: 'Монтаж' },
                worksList: [
                    { id: 1, name: 'Монтаж БМЗ', price: 500000 },
                    { id: 2, name: 'Монтаж трансформатора', price: 300000 }
                ],
                total: 1865410
            }
        },
        type: 'object',
        additionalProperties: true
    }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Object)
], CreateBidDto.prototype, "data", void 0);
//# sourceMappingURL=create-bid.dto.js.map