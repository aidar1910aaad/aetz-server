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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BmzCalculatorController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const bmz_calculator_service_1 = require("./bmz-calculator.service");
let BmzCalculatorController = class BmzCalculatorController {
    constructor(calculatorService) {
        this.calculatorService = calculatorService;
    }
    async calculatePrice(params) {
        return this.calculatorService.calculatePrice(params);
    }
};
exports.BmzCalculatorController = BmzCalculatorController;
__decorate([
    (0, common_1.Post)('calculate'),
    (0, swagger_1.ApiOperation)({
        summary: 'Рассчитать стоимость БМЗ',
        description: 'Рассчитывает стоимость БМЗ на основе площади, толщины стен и выбранного оборудования'
    }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                area: {
                    type: 'number',
                    description: 'Площадь помещения в квадратных метрах',
                    example: 100
                },
                wallThickness: {
                    type: 'number',
                    description: 'Толщина стен в миллиметрах',
                    example: 50
                },
                selectedEquipment: {
                    type: 'array',
                    items: {
                        type: 'number'
                    },
                    description: 'Массив ID выбранного оборудования',
                    example: [1, 2, 3]
                }
            },
            required: ['area', 'wallThickness', 'selectedEquipment']
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Возвращает расчет стоимости БМЗ',
        schema: {
            type: 'object',
            properties: {
                basePrice: {
                    type: 'number',
                    description: 'Базовая стоимость за площадь'
                },
                wallThicknessPrice: {
                    type: 'number',
                    description: 'Стоимость за толщину стен'
                },
                equipment: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            name: {
                                type: 'string',
                                description: 'Название оборудования'
                            },
                            price: {
                                type: 'number',
                                description: 'Стоимость оборудования'
                            },
                            description: {
                                type: 'string',
                                description: 'Описание расчета стоимости'
                            }
                        }
                    }
                },
                totalPrice: {
                    type: 'number',
                    description: 'Общая стоимость'
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Неверные входные данные'
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Не авторизован'
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BmzCalculatorController.prototype, "calculatePrice", null);
exports.BmzCalculatorController = BmzCalculatorController = __decorate([
    (0, swagger_1.ApiTags)('Калькулятор БМЗ'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('bmz/calculator'),
    __metadata("design:paramtypes", [bmz_calculator_service_1.BmzCalculatorService])
], BmzCalculatorController);
//# sourceMappingURL=bmz-calculator.controller.js.map