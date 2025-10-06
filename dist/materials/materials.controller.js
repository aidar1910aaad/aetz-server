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
exports.MaterialsController = void 0;
const common_1 = require("@nestjs/common");
const materials_service_1 = require("./materials.service");
const create_material_dto_1 = require("./dto/create-material.dto");
const update_material_dto_1 = require("./dto/update-material.dto");
const common_2 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
let MaterialsController = class MaterialsController {
    constructor(materialsService) {
        this.materialsService = materialsService;
    }
    create(dto) {
        return this.materialsService.create(dto);
    }
    createMany(dtos) {
        return this.materialsService.createMany(dtos);
    }
    findAll(page, limit, search, sort, order, categoryId) {
        return this.materialsService.findAll({ page, limit, search, sort, order, categoryId });
    }
    getRecentHistory() {
        return this.materialsService.getRecentHistory();
    }
    findOne(id) {
        return this.materialsService.findOne(id);
    }
    update(id, dto) {
        return this.materialsService.update(id, dto);
    }
    getHistory(id) {
        return this.materialsService.getHistory(id);
    }
    delete(id) {
        return this.materialsService.delete(id);
    }
};
exports.MaterialsController = MaterialsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Создание нового материала',
        description: 'Создает новый материал в системе с указанными параметрами. Материал будет доступен для использования в расчетах и заявках.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Материал успешно создан',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'number', example: 1 },
                name: { type: 'string', example: 'Вакуумный выключатель AV-24 1250A' },
                code: { type: 'string', example: '10000009398' },
                unit: { type: 'string', example: 'шт' },
                price: { type: 'number', example: 1610000 },
                category: {
                    type: 'object',
                    properties: {
                        id: { type: 'number', example: 1 },
                        name: { type: 'string', example: 'Выключатели' }
                    }
                },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Некорректные данные' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Не авторизован' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_material_dto_1.CreateMaterialDto]),
    __metadata("design:returntype", void 0)
], MaterialsController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('bulk'),
    (0, swagger_1.ApiOperation)({
        summary: 'Массовый импорт материалов',
        description: 'Импортирует массив материалов в систему. Полезно для загрузки большого количества материалов из файлов или других систем.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Материалы успешно добавлены',
        schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'number', example: 1 },
                    name: { type: 'string', example: 'Вакуумный выключатель AV-24 1250A' },
                    code: { type: 'string', example: '10000009398' },
                    unit: { type: 'string', example: 'шт' },
                    price: { type: 'number', example: 1610000 }
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Некорректные данные' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Не авторизован' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], MaterialsController.prototype, "createMany", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Получить список материалов с фильтрацией',
        description: 'Возвращает список всех материалов с возможностью фильтрации, сортировки и пагинации. Поддерживает поиск по названию и коду материала.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Список материалов получен успешно',
        schema: {
            type: 'object',
            properties: {
                data: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'number', example: 1 },
                            name: { type: 'string', example: 'Вакуумный выключатель AV-24 1250A' },
                            code: { type: 'string', example: '10000009398' },
                            unit: { type: 'string', example: 'шт' },
                            price: { type: 'number', example: 1610000 },
                            category: {
                                type: 'object',
                                properties: {
                                    id: { type: 'number', example: 1 },
                                    name: { type: 'string', example: 'Выключатели' }
                                }
                            }
                        }
                    }
                },
                total: { type: 'number', example: 150 }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Не авторизован' }),
    __param(0, (0, common_2.Query)('page')),
    __param(1, (0, common_2.Query)('limit')),
    __param(2, (0, common_2.Query)('search')),
    __param(3, (0, common_2.Query)('sort')),
    __param(4, (0, common_2.Query)('order')),
    __param(5, (0, common_2.Query)('categoryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, String, Number]),
    __metadata("design:returntype", void 0)
], MaterialsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('history'),
    (0, swagger_1.ApiOperation)({
        summary: 'Получить последние 10 изменений материалов',
        description: 'Возвращает последние 10 изменений материалов в системе'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Последние 10 изменений материалов',
        schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'number' },
                    fieldChanged: { type: 'string' },
                    oldValue: { type: 'string' },
                    newValue: { type: 'string' },
                    changedBy: { type: 'string' },
                    changedAt: { type: 'string', format: 'date-time' },
                    material: {
                        type: 'object',
                        properties: {
                            id: { type: 'number' },
                            name: { type: 'string' },
                            code: { type: 'string' },
                            unit: { type: 'string' },
                            price: { type: 'number' },
                            category: { type: 'object' }
                        }
                    }
                }
            }
        }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MaterialsController.prototype, "getRecentHistory", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Получить материал по ID',
        description: 'Возвращает детальную информацию о конкретном материале по его уникальному идентификатору.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Материал найден',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'number', example: 1 },
                name: { type: 'string', example: 'Вакуумный выключатель AV-24 1250A' },
                code: { type: 'string', example: '10000009398' },
                unit: { type: 'string', example: 'шт' },
                price: { type: 'number', example: 1610000 },
                category: {
                    type: 'object',
                    properties: {
                        id: { type: 'number', example: 1 },
                        name: { type: 'string', example: 'Выключатели' }
                    }
                },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Материал не найден' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Не авторизован' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], MaterialsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Обновить материал',
        description: 'Обновляет существующий материал и автоматически сохраняет историю всех изменений для аудита.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Материал успешно обновлен',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'number', example: 1 },
                name: { type: 'string', example: 'Вакуумный выключатель AV-24 1250A' },
                code: { type: 'string', example: '10000009398' },
                unit: { type: 'string', example: 'шт' },
                price: { type: 'number', example: 1610000 },
                category: {
                    type: 'object',
                    properties: {
                        id: { type: 'number', example: 1 },
                        name: { type: 'string', example: 'Выключатели' }
                    }
                },
                updatedAt: { type: 'string', format: 'date-time' }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Материал не найден' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Некорректные данные' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Не авторизован' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_material_dto_1.UpdateMaterialDto]),
    __metadata("design:returntype", void 0)
], MaterialsController.prototype, "update", null);
__decorate([
    (0, common_1.Get)(':id/history'),
    (0, swagger_1.ApiOperation)({
        summary: 'Получить историю изменений конкретного материала',
        description: 'Возвращает полную историю всех изменений конкретного материала, включая информацию о том, кто и когда вносил изменения.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'История изменений материала получена',
        schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'number', example: 1 },
                    fieldChanged: { type: 'string', example: 'price' },
                    oldValue: { type: 'string', example: '1500000' },
                    newValue: { type: 'string', example: '1610000' },
                    changedBy: { type: 'string', example: 'admin' },
                    changedAt: { type: 'string', format: 'date-time' },
                    material: {
                        type: 'object',
                        properties: {
                            id: { type: 'number', example: 1 },
                            name: { type: 'string', example: 'Вакуумный выключатель AV-24 1250A' }
                        }
                    }
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Материал не найден' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Не авторизован' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], MaterialsController.prototype, "getHistory", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Удалить материал',
        description: 'Безвозвратно удаляет материал из системы. Внимание: данная операция необратима!'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Материал успешно удален',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Материал успешно удален' }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Материал не найден' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Не авторизован' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Недостаточно прав для удаления' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], MaterialsController.prototype, "delete", null);
exports.MaterialsController = MaterialsController = __decorate([
    (0, swagger_1.ApiTags)('Materials'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('materials'),
    __metadata("design:paramtypes", [materials_service_1.MaterialsService])
], MaterialsController);
//# sourceMappingURL=materials.controller.js.map