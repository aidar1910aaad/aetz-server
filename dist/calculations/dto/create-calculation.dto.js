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
exports.CreateCalculationDto = exports.CreateCalculationDataDto = exports.CreateCalculationSettingsDto = exports.CreateCellConfigDto = exports.CreateCellMaterialDto = exports.CreateCategoryDto = exports.CreateItemDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
class CreateItemDto {
}
exports.CreateItemDto = CreateItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1,
        description: 'ID материала из справочника материалов'
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateItemDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Кабель ВВГнг-LS 3x2.5',
        description: 'Наименование материала'
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateItemDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'м',
        description: 'Единица измерения (шт, м, кг и т.д.)'
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateItemDto.prototype, "unit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1000,
        description: 'Цена за единицу измерения'
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateItemDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1,
        description: 'Количество материала'
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateItemDto.prototype, "quantity", void 0);
class CreateCategoryDto {
}
exports.CreateCategoryDto = CreateCategoryDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Кабельная продукция',
        description: 'Название категории материалов'
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCategoryDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [CreateItemDto],
        description: 'Список материалов в категории'
    }),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateItemDto),
    __metadata("design:type", Array)
], CreateCategoryDto.prototype, "items", void 0);
class CreateCellMaterialDto {
}
exports.CreateCellMaterialDto = CreateCellMaterialDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1,
        description: 'ID оборудования из справочника'
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateCellMaterialDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Выключатель ВА57-35',
        description: 'Наименование оборудования'
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCellMaterialDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 50000,
        description: 'Цена оборудования'
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateCellMaterialDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: ['switch', 'rza', 'counter', 'sr', 'tsn', 'tn', 'pu', 'disconnector', 'busbar', 'busbridge'],
        description: 'Тип оборудования: выключатель, РЗА, счетчик, СР, ТСН, ТН, ПУ, разъединитель, шина или шинный мост',
        example: 'switch'
    }),
    (0, class_validator_1.IsEnum)(['switch', 'rza', 'counter', 'sr', 'tsn', 'tn', 'pu', 'disconnector', 'busbar', 'busbridge']),
    __metadata("design:type", String)
], CreateCellMaterialDto.prototype, "type", void 0);
class CreateCellConfigDto {
}
exports.CreateCellConfigDto = CreateCellConfigDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: ['0.4kv', '10kv', '20kv', 'rza', 'pu', 'disconnector', 'busbar', 'busbridge', 'switch', 'tn', 'tsn', 'input', 'section_switch', 'outgoing'],
        description: 'Тип ячейки: 0.4кВ, 10кВ, 20кВ, РЗА, ПУ, разъединитель, шина, шинный мост, выключатель, ТН, ТСН, ввод, секционный выключатель или отходящая',
        example: '0.4kv'
    }),
    (0, class_validator_1.IsEnum)(['0.4kv', '10kv', '20kv', 'rza', 'pu', 'disconnector', 'busbar', 'busbridge', 'switch', 'tn', 'tsn', 'input', 'section_switch', 'outgoing']),
    __metadata("design:type", String)
], CreateCellConfigDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Конфигурация оборудования ячейки',
        example: {
            switch: { id: 1, name: 'Выключатель ВА57-35', price: 50000, type: 'switch' },
            rza: { id: 2, name: 'РЗА Устройство', price: 75000, type: 'rza' },
            counter: { id: 3, name: 'Счетчик Меркурий', price: 25000, type: 'counter' },
            sr: { id: 4, name: 'СР Устройство', price: 30000, type: 'sr' },
            tsn: { id: 5, name: 'ТСН Трансформатор', price: 45000, type: 'tsn' },
            tn: { id: 6, name: 'ТН Трансформатор', price: 40000, type: 'tn' },
            tt: [
                { id: 7, name: 'ТТ Трансформатор тока', price: 15000, type: 'switch' },
                { id: 8, name: 'ТТ Трансформатор тока 2', price: 18000, type: 'switch' }
            ],
            pu: [
                { id: 9, name: 'ПУ Прибор учета', price: 12000, type: 'counter' },
                { id: 10, name: 'ПУ Прибор учета 2', price: 14000, type: 'counter' }
            ],
            disconnector: [
                { id: 11, name: 'Разъединитель РЛНД', price: 25000, type: 'disconnector' },
                { id: 12, name: 'Разъединитель РЛНД 2', price: 28000, type: 'disconnector' }
            ],
            busbar: [
                { id: 13, name: 'Шина медная 60x6', price: 8000, type: 'busbar' },
                { id: 14, name: 'Шина медная 80x8', price: 10000, type: 'busbar' }
            ],
            busbridge: [
                { id: 15, name: 'Шинный мост 60x6', price: 12000, type: 'busbridge' },
                { id: 16, name: 'Шинный мост 80x8', price: 15000, type: 'busbridge' }
            ]
        }
    }),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateCellConfigDto.prototype, "materials", void 0);
class CreateCalculationSettingsDto {
}
exports.CreateCalculationSettingsDto = CreateCalculationSettingsDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1,
        description: 'Количество часов на производство'
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateCalculationSettingsDto.prototype, "manufacturingHours", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 2000,
        description: 'Часовая ставка (тенге)'
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateCalculationSettingsDto.prototype, "hourlyRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 10,
        description: 'Процент общепроизводственных расходов'
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateCalculationSettingsDto.prototype, "overheadPercentage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 15,
        description: 'Процент административных расходов'
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateCalculationSettingsDto.prototype, "adminPercentage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 10,
        description: 'Процент плановых накоплений'
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateCalculationSettingsDto.prototype, "plannedProfitPercentage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 12,
        description: 'Ставка НДС в процентах'
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateCalculationSettingsDto.prototype, "ndsPercentage", void 0);
class CreateCalculationDataDto {
}
exports.CreateCalculationDataDto = CreateCalculationDataDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [CreateCategoryDto],
        description: 'Список категорий с материалами'
    }),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateCategoryDto),
    __metadata("design:type", Array)
], CreateCalculationDataDto.prototype, "categories", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: CreateCalculationSettingsDto,
        description: 'Настройки расчета (часы, ставки, проценты)'
    }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => CreateCalculationSettingsDto),
    __metadata("design:type", CreateCalculationSettingsDto)
], CreateCalculationDataDto.prototype, "calculation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: CreateCellConfigDto,
        description: 'Конфигурация ячейки (тип и оборудование)'
    }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => CreateCellConfigDto),
    __metadata("design:type", CreateCellConfigDto)
], CreateCalculationDataDto.prototype, "cellConfig", void 0);
class CreateCalculationDto {
}
exports.CreateCalculationDto = CreateCalculationDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Камера КСО А12-10 900×1000',
        description: 'Название калькуляции'
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCalculationDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '900x1000',
        description: 'Уникальный идентификатор калькуляции (slug)'
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCalculationDto.prototype, "slug", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1,
        description: 'ID группы калькуляций'
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateCalculationDto.prototype, "groupId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: CreateCalculationDataDto,
        description: 'Данные калькуляции (категории, настройки, конфигурация ячейки)'
    }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => CreateCalculationDataDto),
    __metadata("design:type", CreateCalculationDataDto)
], CreateCalculationDto.prototype, "data", void 0);
//# sourceMappingURL=create-calculation.dto.js.map