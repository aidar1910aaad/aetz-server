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
exports.SwitchgearController = void 0;
const common_1 = require("@nestjs/common");
const switchgear_service_1 = require("./switchgear.service");
const create_switchgear_config_dto_1 = require("./dto/create-switchgear-config.dto");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const user_entity_1 = require("../users/entities/user.entity");
const switchgear_config_entity_1 = require("./entities/switchgear-config.entity");
let SwitchgearController = class SwitchgearController {
    constructor(switchgearService) {
        this.switchgearService = switchgearService;
    }
    create(createSwitchgearConfigDto) {
        return this.switchgearService.create(createSwitchgearConfigDto);
    }
    findAll(type, amperage, group) {
        return this.switchgearService.findAll({ type, amperage, group });
    }
    findOne(id) {
        return this.switchgearService.findOne(id);
    }
    update(id, updateSwitchgearConfigDto) {
        return this.switchgearService.update(id, updateSwitchgearConfigDto);
    }
    remove(id) {
        return this.switchgearService.remove(id);
    }
};
exports.SwitchgearController = SwitchgearController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.PTO),
    (0, swagger_1.ApiOperation)({ summary: 'Создать новую конфигурацию ячеек РУ' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Конфигурация успешно создана',
        type: switchgear_config_entity_1.SwitchgearConfig,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_switchgear_config_dto_1.CreateSwitchgearConfigDto]),
    __metadata("design:returntype", void 0)
], SwitchgearController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Получить список конфигураций ячеек РУ' }),
    (0, swagger_1.ApiQuery)({ name: 'type', required: false, description: 'Фильтр по типу' }),
    (0, swagger_1.ApiQuery)({
        name: 'amperage',
        required: false,
        description: 'Фильтр по току',
    }),
    (0, swagger_1.ApiQuery)({ name: 'group', required: false, description: 'Фильтр по группе' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Список конфигураций',
        type: [switchgear_config_entity_1.SwitchgearConfig],
    }),
    __param(0, (0, common_1.Query)('type')),
    __param(1, (0, common_1.Query)('amperage')),
    __param(2, (0, common_1.Query)('group')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, String]),
    __metadata("design:returntype", void 0)
], SwitchgearController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Получить конфигурацию по ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID конфигурации' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Конфигурация найдена',
        type: switchgear_config_entity_1.SwitchgearConfig,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Конфигурация не найдена' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], SwitchgearController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.PTO),
    (0, swagger_1.ApiOperation)({ summary: 'Обновить конфигурацию' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID конфигурации' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Конфигурация обновлена',
        type: switchgear_config_entity_1.SwitchgearConfig,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Конфигурация не найдена' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, create_switchgear_config_dto_1.CreateSwitchgearConfigDto]),
    __metadata("design:returntype", void 0)
], SwitchgearController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.PTO),
    (0, swagger_1.ApiOperation)({ summary: 'Удалить конфигурацию' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID конфигурации' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Конфигурация удалена' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Конфигурация не найдена' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], SwitchgearController.prototype, "remove", null);
exports.SwitchgearController = SwitchgearController = __decorate([
    (0, swagger_1.ApiTags)('Switchgear Configurations'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('switchgear'),
    __metadata("design:paramtypes", [switchgear_service_1.SwitchgearService])
], SwitchgearController);
//# sourceMappingURL=switchgear.controller.js.map