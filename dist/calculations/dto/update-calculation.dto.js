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
exports.UpdateCalculationDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const create_calculation_dto_1 = require("./create-calculation.dto");
class UpdateCalculationDto {
}
exports.UpdateCalculationDto = UpdateCalculationDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Камера КСО А12-10 900×1000',
        description: 'Новое название калькуляции. Если не указано, останется прежним'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCalculationDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '900x1000',
        description: 'Новый уникальный идентификатор калькуляции (slug). Если не указан, останется прежним'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCalculationDto.prototype, "slug", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: create_calculation_dto_1.CreateCalculationDataDto,
        description: `Данные калькуляции. Можно обновить:
- Категории и материалы
- Настройки расчета (часы, ставки, проценты)
- Конфигурацию ячейки (тип и оборудование)
Если какие-то поля не указаны, они останутся без изменений`,
        example: {
            categories: [
                {
                    name: "Кабельная продукция",
                    items: [
                        {
                            id: 1,
                            name: "Кабель ВВГнг-LS 3x2.5",
                            unit: "м",
                            price: 1000,
                            quantity: 2
                        }
                    ]
                }
            ],
            calculation: {
                manufacturingHours: 1,
                hourlyRate: 2000,
                overheadPercentage: 10,
                adminPercentage: 15,
                plannedProfitPercentage: 10,
                ndsPercentage: 12
            },
            cellConfig: {
                type: "input",
                materials: {
                    switch: {
                        id: 1,
                        name: "Выключатель ВА57-35",
                        price: 50000,
                        type: "switch"
                    },
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
            }
        }
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => create_calculation_dto_1.CreateCalculationDataDto),
    __metadata("design:type", create_calculation_dto_1.CreateCalculationDataDto)
], UpdateCalculationDto.prototype, "data", void 0);
//# sourceMappingURL=update-calculation.dto.js.map