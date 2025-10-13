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
exports.CurrencySettingsController = void 0;
const common_1 = require("@nestjs/common");
const currency_settings_service_1 = require("./currency-settings.service");
const currency_settings_entity_1 = require("./entities/currency-settings.entity");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const user_entity_1 = require("../users/entities/user.entity");
const swagger_1 = require("@nestjs/swagger");
const update_currency_settings_dto_1 = require("./dto/update-currency-settings.dto");
const public_decorator_1 = require("../common/decorators/public.decorator");
let CurrencySettingsController = class CurrencySettingsController {
    constructor(currencySettingsService) {
        this.currencySettingsService = currencySettingsService;
    }
    async getSettings() {
        try {
            return await this.currencySettingsService.getSettings();
        }
        catch (error) {
            throw new common_1.HttpException(error.message || 'Ошибка при получении настроек валют', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateSettings(updateData) {
        try {
            return await this.currencySettingsService.updateSettings(updateData);
        }
        catch (error) {
            throw new common_1.HttpException(error.message || 'Ошибка при обновлении настроек валют', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.CurrencySettingsController = CurrencySettingsController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Получить текущие курсы валют и настройки' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Возвращает текущие настройки',
        type: currency_settings_entity_1.CurrencySettings
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Внутренняя ошибка сервера'
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CurrencySettingsController.prototype, "getSettings", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Put)(),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.PTO),
    (0, swagger_1.ApiOperation)({ summary: 'Обновить курсы валют и настройки' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Настройки успешно обновлены',
        type: currency_settings_entity_1.CurrencySettings
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Доступ запрещен. Требуются права администратора или PTO'
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_currency_settings_dto_1.UpdateCurrencySettingsDto]),
    __metadata("design:returntype", Promise)
], CurrencySettingsController.prototype, "updateSettings", null);
exports.CurrencySettingsController = CurrencySettingsController = __decorate([
    (0, swagger_1.ApiTags)('currency-settings'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Controller)('currency-settings'),
    __metadata("design:paramtypes", [currency_settings_service_1.CurrencySettingsService])
], CurrencySettingsController);
//# sourceMappingURL=currency-settings.controller.js.map