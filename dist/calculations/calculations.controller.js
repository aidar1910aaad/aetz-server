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
exports.CalculationsController = void 0;
const common_1 = require("@nestjs/common");
const calculations_service_1 = require("./calculations.service");
const create_calculation_dto_1 = require("./dto/create-calculation.dto");
const create_calculation_group_dto_1 = require("./dto/create-calculation-group.dto");
const update_calculation_dto_1 = require("./dto/update-calculation.dto");
const update_calculation_group_dto_1 = require("./dto/update-calculation-group.dto");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const user_entity_1 = require("../users/entities/user.entity");
const calculation_entity_1 = require("./entities/calculation.entity");
const calculation_group_entity_1 = require("./entities/calculation-group.entity");
let CalculationsController = class CalculationsController {
    constructor(calculationsService) {
        this.calculationsService = calculationsService;
    }
    getAllGroups() {
        return this.calculationsService.getAllGroups();
    }
    updateGroup(slug, dto) {
        console.log('=== ОБНОВЛЕНИЕ ГРУППЫ ===');
        console.log('Slug:', slug);
        console.log('DTO:', JSON.stringify(dto, null, 2));
        console.log('DTO keys:', Object.keys(dto));
        return this.calculationsService.updateGroup(slug, dto);
    }
    createCalculation(dto) {
        return this.calculationsService.createCalculation(dto);
    }
    createGroup(dto) {
        return this.calculationsService.createGroup(dto);
    }
    getAllCalculations() {
        return this.calculationsService.getAllCalculations();
    }
    async deleteGroupById(id) {
        console.log('=== КОНТРОЛЛЕР: УДАЛЕНИЕ ГРУППЫ ===');
        console.log('Получен запрос на удаление группы с ID:', id, 'тип:', typeof id);
        return this.calculationsService.deleteGroupById(id);
    }
    getOne(groupSlug, calcSlug) {
        return this.calculationsService.getCalculation(groupSlug, calcSlug);
    }
    getGroupCalculations(slug) {
        return this.calculationsService.getCalculationsByGroupSlug(slug);
    }
    updateCalculation(groupSlug, calcSlug, dto) {
        return this.calculationsService.updateCalculation(groupSlug, calcSlug, dto);
    }
    deleteCalculation(groupSlug, calcSlug) {
        return this.calculationsService.deleteCalculation(groupSlug, calcSlug);
    }
};
exports.CalculationsController = CalculationsController;
__decorate([
    (0, common_1.Get)('groups'),
    (0, swagger_1.ApiOperation)({ summary: 'Получить список всех групп калькуляций' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: [calculation_group_entity_1.CalculationGroup] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CalculationsController.prototype, "getAllGroups", null);
__decorate([
    (0, common_1.Patch)('groups/:slug'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.PTO),
    (0, swagger_1.ApiOperation)({ summary: 'Обновить группу калькуляций' }),
    (0, swagger_1.ApiParam)({
        name: 'slug',
        type: String,
        description: 'Slug группы калькуляций',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        type: calculation_group_entity_1.CalculationGroup,
        description: 'Группа успешно обновлена',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Группа не найдена' }),
    __param(0, (0, common_1.Param)('slug')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_calculation_group_dto_1.UpdateCalculationGroupDto]),
    __metadata("design:returntype", void 0)
], CalculationsController.prototype, "updateGroup", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.PTO),
    (0, swagger_1.ApiOperation)({ summary: 'Создать калькуляцию в группе' }),
    (0, swagger_1.ApiResponse)({ status: 201, type: calculation_entity_1.Calculation }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_calculation_dto_1.CreateCalculationDto]),
    __metadata("design:returntype", void 0)
], CalculationsController.prototype, "createCalculation", null);
__decorate([
    (0, common_1.Post)('groups'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.PTO),
    (0, swagger_1.ApiOperation)({ summary: 'Создать группу калькуляций' }),
    (0, swagger_1.ApiResponse)({ status: 201, type: calculation_group_entity_1.CalculationGroup }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_calculation_group_dto_1.CreateCalculationGroupDto]),
    __metadata("design:returntype", void 0)
], CalculationsController.prototype, "createGroup", null);
__decorate([
    (0, common_1.Get)('all'),
    (0, swagger_1.ApiOperation)({ summary: 'Получить список всех калькуляций из всех групп' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: [calculation_entity_1.Calculation] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CalculationsController.prototype, "getAllCalculations", null);
__decorate([
    (0, common_1.Delete)('groups/:id'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.PTO),
    (0, swagger_1.ApiOperation)({ summary: 'Удалить группу калькуляций по ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID группы калькуляций', type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Группа успешно удалена' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Группа не найдена' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CalculationsController.prototype, "deleteGroupById", null);
__decorate([
    (0, common_1.Get)(':groupSlug/:calcSlug'),
    (0, swagger_1.ApiOperation)({
        summary: 'Получить конкретную калькуляцию по slug группы и калькуляции',
    }),
    (0, swagger_1.ApiParam)({
        name: 'groupSlug',
        type: String,
        description: 'Slug группы калькуляции',
    }),
    (0, swagger_1.ApiParam)({ name: 'calcSlug', type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, type: calculation_entity_1.Calculation }),
    __param(0, (0, common_1.Param)('groupSlug')),
    __param(1, (0, common_1.Param)('calcSlug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], CalculationsController.prototype, "getOne", null);
__decorate([
    (0, common_1.Get)('groups/:slug/calculations'),
    (0, swagger_1.ApiOperation)({ summary: 'Получить список калькуляций в группе' }),
    (0, swagger_1.ApiParam)({ name: 'slug', type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, type: [calculation_entity_1.Calculation] }),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CalculationsController.prototype, "getGroupCalculations", null);
__decorate([
    (0, common_1.Patch)(':groupSlug/:calcSlug'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.PTO),
    (0, swagger_1.ApiOperation)({
        summary: 'Обновить калькуляцию',
        description: 'Обновляет калькуляцию. Можно отправить как полные данные, так и только измененные части. Все поля являются необязательными.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'groupSlug',
        type: String,
        description: 'Slug группы калькуляции',
    }),
    (0, swagger_1.ApiParam)({
        name: 'calcSlug',
        type: String,
        description: 'Slug калькуляции',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        type: calculation_entity_1.Calculation,
        description: 'Возвращает обновленную калькуляцию с актуальными ценами материалов',
    }),
    __param(0, (0, common_1.Param)('groupSlug')),
    __param(1, (0, common_1.Param)('calcSlug')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_calculation_dto_1.UpdateCalculationDto]),
    __metadata("design:returntype", void 0)
], CalculationsController.prototype, "updateCalculation", null);
__decorate([
    (0, common_1.Delete)(':groupSlug/:calcSlug'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.PTO),
    (0, swagger_1.ApiOperation)({ summary: 'Удалить калькуляцию' }),
    (0, swagger_1.ApiParam)({
        name: 'groupSlug',
        type: String,
        description: 'Slug группы калькуляции',
    }),
    (0, swagger_1.ApiParam)({ name: 'calcSlug', type: String, description: 'Slug калькуляции' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Калькуляция успешно удалена' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Калькуляция не найдена' }),
    __param(0, (0, common_1.Param)('groupSlug')),
    __param(1, (0, common_1.Param)('calcSlug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], CalculationsController.prototype, "deleteCalculation", null);
exports.CalculationsController = CalculationsController = __decorate([
    (0, swagger_1.ApiTags)('Calculations'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('calculations'),
    __metadata("design:paramtypes", [calculations_service_1.CalculationsService])
], CalculationsController);
//# sourceMappingURL=calculations.controller.js.map