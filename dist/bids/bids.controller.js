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
exports.BidsController = void 0;
const common_1 = require("@nestjs/common");
const bids_service_1 = require("./bids.service");
const create_bid_dto_1 = require("./dto/create-bid.dto");
const update_bid_dto_1 = require("./dto/update-bid.dto");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const user_entity_1 = require("../users/entities/user.entity");
const bid_entity_1 = require("./entities/bid.entity");
let BidsController = class BidsController {
    constructor(bidsService) {
        this.bidsService = bidsService;
    }
    create(createBidDto) {
        return this.bidsService.create(createBidDto);
    }
    findAll(userId) {
        if (userId) {
            return this.bidsService.findByUser(userId);
        }
        return this.bidsService.findAll();
    }
    findOne(id) {
        return this.bidsService.findOne(id);
    }
    findByBidNumber(bidNumber) {
        return this.bidsService.findByBidNumber(bidNumber);
    }
    update(id, updateBidDto) {
        return this.bidsService.update(id, updateBidDto);
    }
    remove(id) {
        return this.bidsService.remove(id);
    }
};
exports.BidsController = BidsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.PTO, user_entity_1.UserRole.MANAGER),
    (0, swagger_1.ApiOperation)({
        summary: 'Создать новую заявку',
        description: 'Доступно для: Администратор, ПТО, Менеджер. Создает заявку с автоматической генерацией номера.'
    }),
    (0, swagger_1.ApiBody)({
        type: create_bid_dto_1.CreateBidDto,
        description: 'Данные для создания заявки',
        examples: {
            'БКТП заявка': {
                summary: 'Пример заявки БКТП',
                value: {
                    type: 'БКТП',
                    date: '2025-09-17',
                    client: 'ООО Ромашка',
                    taskNumber: 'TASK-001',
                    totalAmount: 52899246.59,
                    user: {
                        id: 4,
                        username: 'aidarr',
                        firstName: 'Айдар',
                        lastName: 'Айдарович'
                    },
                    data: {
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
                    }
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Заявка успешно создана',
        type: bid_entity_1.Bid,
        schema: {
            example: {
                id: 1,
                bidNumber: 'BID-2024-001',
                type: 'БКТП',
                date: '2025-09-17',
                client: 'фывафыва',
                taskNumber: 'укфыва',
                totalAmount: 52899246.59,
                data: {
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
                user: { id: 4, username: 'aidarr', firstName: 'Айдар', lastName: 'Айдарович' },
                createdAt: '2024-09-17T10:00:00Z',
                updatedAt: '2024-09-17T10:00:00Z'
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Неверные данные' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Не авторизован' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Недостаточно прав' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_bid_dto_1.CreateBidDto]),
    __metadata("design:returntype", void 0)
], BidsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.PTO, user_entity_1.UserRole.MANAGER),
    (0, swagger_1.ApiOperation)({
        summary: 'Получить все заявки',
        description: 'Доступно для: Администратор, ПТО, Менеджер. Можно фильтровать по пользователю.'
    }),
    (0, swagger_1.ApiQuery)({
        name: 'userId',
        required: false,
        description: 'Фильтр по ID пользователя',
        example: 4
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Список заявок',
        type: [bid_entity_1.Bid]
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Не авторизован' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Недостаточно прав' }),
    __param(0, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], BidsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.PTO, user_entity_1.UserRole.MANAGER),
    (0, swagger_1.ApiOperation)({
        summary: 'Получить заявку по ID',
        description: 'Доступно для: Администратор, ПТО, Менеджер'
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        type: 'number',
        description: 'ID заявки',
        example: 1
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Заявка найдена',
        type: bid_entity_1.Bid
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Заявка не найдена' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Не авторизован' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Недостаточно прав' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], BidsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('number/:bidNumber'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.PTO, user_entity_1.UserRole.MANAGER),
    (0, swagger_1.ApiOperation)({
        summary: 'Получить заявку по номеру',
        description: 'Доступно для: Администратор, ПТО, Менеджер'
    }),
    (0, swagger_1.ApiParam)({
        name: 'bidNumber',
        type: 'string',
        description: 'Номер заявки',
        example: 'BID-2024-001'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Заявка найдена',
        type: bid_entity_1.Bid
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Заявка не найдена' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Не авторизован' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Недостаточно прав' }),
    __param(0, (0, common_1.Param)('bidNumber')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BidsController.prototype, "findByBidNumber", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.PTO, user_entity_1.UserRole.MANAGER),
    (0, swagger_1.ApiOperation)({
        summary: 'Обновить заявку',
        description: 'Доступно для: Администратор, ПТО, Менеджер. Можно обновить любые поля частично.'
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        type: 'number',
        description: 'ID заявки',
        example: 1
    }),
    (0, swagger_1.ApiBody)({
        type: update_bid_dto_1.UpdateBidDto,
        description: 'Данные для обновления заявки (все поля опциональны)',
        examples: {
            'Обновление клиента': {
                summary: 'Обновить только клиента',
                value: {
                    client: 'Новое название клиента'
                }
            },
            'Обновление данных': {
                summary: 'Обновить данные заявки',
                value: {
                    data: {
                        bmz: {
                            buildingType: 'bmz',
                            length: 6000,
                            width: 7000,
                            height: 3500,
                            thickness: 120,
                            total: 2000000
                        }
                    }
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Заявка успешно обновлена',
        type: bid_entity_1.Bid
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Заявка не найдена' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Неверные данные' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Не авторизован' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Недостаточно прав' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_bid_dto_1.UpdateBidDto]),
    __metadata("design:returntype", void 0)
], BidsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.PTO, user_entity_1.UserRole.MANAGER),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({
        summary: 'Удалить заявку',
        description: 'Доступно для: Администратор, ПТО, Менеджер'
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        type: 'number',
        description: 'ID заявки',
        example: 1
    }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Заявка успешно удалена' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Заявка не найдена' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Не авторизован' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Недостаточно прав' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], BidsController.prototype, "remove", null);
exports.BidsController = BidsController = __decorate([
    (0, swagger_1.ApiTags)('Заявки'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('bids'),
    __metadata("design:paramtypes", [bids_service_1.BidsService])
], BidsController);
//# sourceMappingURL=bids.controller.js.map