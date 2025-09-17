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
exports.CreateSettingDto = exports.EquipmentSettingsDto = exports.CategorySettingDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
class CategorySettingDto {
}
exports.CategorySettingDto = CategorySettingDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1,
        description: 'ID категории из базы данных',
        type: Number,
        required: true
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CategorySettingDto.prototype, "categoryId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'switch',
        description: 'Тип настройки (может быть любая строка)',
        type: String,
        required: true
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CategorySettingDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: true,
        description: 'Видимость настройки в интерфейсе',
        type: Boolean,
        default: true,
        required: true
    }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CategorySettingDto.prototype, "isVisible", void 0);
class EquipmentSettingsDto {
    constructor() {
        this.rusn = [];
        this.bmz = [];
        this.runn = [];
        this.work = [];
        this.transformer = [];
        this.additionalEquipment = [];
        this.sr = [];
        this.tsn = [];
        this.tn = [];
    }
}
exports.EquipmentSettingsDto = EquipmentSettingsDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [CategorySettingDto],
        description: 'Настройки для РУСН (Распределительное устройство среднего напряжения)',
        example: [
            {
                categoryId: 1,
                type: 'switch',
                isVisible: true
            }
        ],
        required: false
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CategorySettingDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], EquipmentSettingsDto.prototype, "rusn", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [CategorySettingDto],
        description: 'Настройки для БМЗ (Блок мотор-генератор)',
        example: [
            {
                categoryId: 2,
                type: 'counter',
                isVisible: true
            }
        ],
        required: false
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CategorySettingDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], EquipmentSettingsDto.prototype, "bmz", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [CategorySettingDto],
        description: 'Настройки для РУНН (Распределительное устройство низкого напряжения)',
        example: [
            {
                categoryId: 3,
                type: 'rza',
                isVisible: true
            }
        ],
        required: false
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CategorySettingDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], EquipmentSettingsDto.prototype, "runn", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [CategorySettingDto],
        description: 'Настройки для работы',
        example: [
            {
                categoryId: 4,
                type: 'transformer',
                isVisible: true
            }
        ],
        required: false
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CategorySettingDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], EquipmentSettingsDto.prototype, "work", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [CategorySettingDto],
        description: 'Настройки для трансформатора',
        example: [
            {
                categoryId: 5,
                type: 'counter',
                isVisible: true
            }
        ],
        required: false
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CategorySettingDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], EquipmentSettingsDto.prototype, "transformer", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [CategorySettingDto],
        description: 'Настройки для дополнительного оборудования',
        example: [
            {
                categoryId: 6,
                type: 'rza',
                isVisible: true
            }
        ],
        required: false
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CategorySettingDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], EquipmentSettingsDto.prototype, "additionalEquipment", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [CategorySettingDto],
        description: 'Настройки для СР (Система релейной защиты)',
        example: [
            {
                categoryId: 7,
                type: 'switch',
                isVisible: true
            }
        ],
        required: false
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CategorySettingDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], EquipmentSettingsDto.prototype, "sr", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [CategorySettingDto],
        description: 'Настройки для ТСН (Трансформатор собственных нужд)',
        example: [
            {
                categoryId: 8,
                type: 'counter',
                isVisible: true
            }
        ],
        required: false
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CategorySettingDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], EquipmentSettingsDto.prototype, "tsn", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [CategorySettingDto],
        description: 'Настройки для ТН (Трансформатор напряжения)',
        example: [
            {
                categoryId: 9,
                type: 'transformer',
                isVisible: true
            }
        ],
        required: false
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CategorySettingDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], EquipmentSettingsDto.prototype, "tn", void 0);
class CreateSettingDto {
}
exports.CreateSettingDto = CreateSettingDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        type: EquipmentSettingsDto,
        description: 'Настройки для всех типов оборудования. При обновлении можно отправить только те секции, которые нужно изменить.',
        example: {
            rusn: [
                {
                    categoryId: 1,
                    type: 'switch',
                    isVisible: true
                }
            ],
            bmz: [
                {
                    categoryId: 2,
                    type: 'counter',
                    isVisible: true
                }
            ]
        },
        required: true
    }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => EquipmentSettingsDto),
    __metadata("design:type", EquipmentSettingsDto)
], CreateSettingDto.prototype, "settings", void 0);
//# sourceMappingURL=create-setting.dto.js.map