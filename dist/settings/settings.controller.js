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
exports.SettingsController = void 0;
const common_1 = require("@nestjs/common");
const settings_service_1 = require("./settings.service");
const setting_entity_1 = require("./entities/setting.entity");
const create_setting_dto_1 = require("./dto/create-setting.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const user_entity_1 = require("../users/entities/user.entity");
const swagger_1 = require("@nestjs/swagger");
let SettingsController = class SettingsController {
    constructor(settingsService) {
        this.settingsService = settingsService;
    }
    async getSettings() {
        return this.settingsService.getSettings();
    }
    async create(createSettingDto) {
        return this.settingsService.create(createSettingDto);
    }
    async update(updateSettingDto) {
        return this.settingsService.update(updateSettingDto);
    }
};
exports.SettingsController = SettingsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Получить текущие настройки',
        description: 'Возвращает единственную запись настроек из базы данных'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Возвращает текущие настройки',
        type: setting_entity_1.Setting
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Требуется авторизация'
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Настройки не найдены'
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "getSettings", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Создать начальные настройки',
        description: 'Создает первую запись настроек. Этот метод можно использовать только один раз при первой инициализации.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Настройки успешно созданы',
        type: setting_entity_1.Setting
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Требуется авторизация'
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Доступ запрещен. Требуются права администратора'
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_setting_dto_1.CreateSettingDto]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.PTO),
    (0, swagger_1.ApiOperation)({
        summary: 'Обновить текущие настройки',
        description: 'Обновляет существующие настройки. Можно отправить только те секции, которые нужно обновить. Остальные останутся без изменений.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Настройки успешно обновлены',
        type: setting_entity_1.Setting
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Требуется авторизация'
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Доступ запрещен. Требуются права администратора или PTO'
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Настройки не найдены'
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_setting_dto_1.CreateSettingDto]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "update", null);
exports.SettingsController = SettingsController = __decorate([
    (0, swagger_1.ApiTags)('settings'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('settings'),
    __metadata("design:paramtypes", [settings_service_1.SettingsService])
], SettingsController);
//# sourceMappingURL=settings.controller.js.map