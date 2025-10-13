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
exports.BmzSettingsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const user_entity_1 = require("../users/entities/user.entity");
const bmz_settings_service_1 = require("./bmz-settings.service");
const update_bmz_settings_dto_1 = require("./dto/update-bmz-settings.dto");
const bmz_settings_entity_1 = require("./entities/bmz-settings.entity");
let BmzSettingsController = class BmzSettingsController {
    constructor(bmzSettingsService) {
        this.bmzSettingsService = bmzSettingsService;
    }
    async getSettings() {
        return this.bmzSettingsService.getSettings();
    }
    async updateSettings(updateSettingsDto) {
        return this.bmzSettingsService.updateSettings(updateSettingsDto);
    }
};
exports.BmzSettingsController = BmzSettingsController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.PTO),
    (0, swagger_1.ApiOperation)({ summary: 'Получить настройки БМЗ' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Настройки успешно получены',
        type: bmz_settings_entity_1.BmzSettings
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Не авторизован'
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Нет доступа'
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BmzSettingsController.prototype, "getSettings", null);
__decorate([
    (0, common_1.Put)(),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.PTO),
    (0, swagger_1.ApiOperation)({ summary: 'Обновить настройки БМЗ' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Настройки успешно обновлены',
        type: bmz_settings_entity_1.BmzSettings
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Неверные данные'
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Не авторизован'
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Нет доступа'
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_bmz_settings_dto_1.UpdateBmzSettingsDto]),
    __metadata("design:returntype", Promise)
], BmzSettingsController.prototype, "updateSettings", null);
exports.BmzSettingsController = BmzSettingsController = __decorate([
    (0, swagger_1.ApiTags)('BMZ Settings'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('bmz/settings'),
    __metadata("design:paramtypes", [bmz_settings_service_1.BmzSettingsService])
], BmzSettingsController);
//# sourceMappingURL=bmz-settings.controller.js.map