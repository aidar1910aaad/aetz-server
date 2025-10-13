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
exports.TransformersController = void 0;
const common_1 = require("@nestjs/common");
const transformers_service_1 = require("./transformers.service");
const create_transformer_dto_1 = require("./dto/create-transformer.dto");
const update_transformer_dto_1 = require("./dto/update-transformer.dto");
const create_transformers_dto_1 = require("./dto/create-transformers.dto");
const transformer_entity_1 = require("./entities/transformer.entity");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const user_entity_1 = require("../users/entities/user.entity");
let TransformersController = class TransformersController {
    constructor(transformersService) {
        this.transformersService = transformersService;
    }
    create(createTransformerDto) {
        return this.transformersService.create(createTransformerDto);
    }
    createMany(createTransformersDto) {
        return this.transformersService.createMany(createTransformersDto);
    }
    findAll() {
        return this.transformersService.findAll();
    }
    findByVoltage(voltage) {
        return this.transformersService.findByVoltage(voltage);
    }
    findByType(type) {
        return this.transformersService.findByType(type);
    }
    findByManufacturer(manufacturer) {
        return this.transformersService.findByManufacturer(manufacturer);
    }
    findOne(id) {
        return this.transformersService.findOne(id);
    }
    update(id, updateTransformerDto) {
        return this.transformersService.update(id, updateTransformerDto);
    }
    remove(id) {
        return this.transformersService.remove(id);
    }
};
exports.TransformersController = TransformersController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.PTO),
    (0, swagger_1.ApiOperation)({ summary: 'Создать новый трансформатор' }),
    (0, swagger_1.ApiResponse)({ status: 201, type: transformer_entity_1.Transformer }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_transformer_dto_1.CreateTransformerDto]),
    __metadata("design:returntype", void 0)
], TransformersController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('batch'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.PTO),
    (0, swagger_1.ApiOperation)({ summary: 'Создать несколько трансформаторов' }),
    (0, swagger_1.ApiResponse)({ status: 201, type: [transformer_entity_1.Transformer] }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_transformers_dto_1.CreateTransformersDto]),
    __metadata("design:returntype", void 0)
], TransformersController.prototype, "createMany", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Получить список всех трансформаторов' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: [transformer_entity_1.Transformer] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TransformersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('voltage/:voltage'),
    (0, swagger_1.ApiOperation)({ summary: 'Получить трансформаторы по напряжению' }),
    (0, swagger_1.ApiParam)({ name: 'voltage', type: String, description: 'Номинальное напряжение' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: [transformer_entity_1.Transformer] }),
    __param(0, (0, common_1.Param)('voltage')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TransformersController.prototype, "findByVoltage", null);
__decorate([
    (0, common_1.Get)('type/:type'),
    (0, swagger_1.ApiOperation)({ summary: 'Получить трансформаторы по типу' }),
    (0, swagger_1.ApiParam)({ name: 'type', type: String, description: 'Тип трансформатора' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: [transformer_entity_1.Transformer] }),
    __param(0, (0, common_1.Param)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TransformersController.prototype, "findByType", null);
__decorate([
    (0, common_1.Get)('manufacturer/:manufacturer'),
    (0, swagger_1.ApiOperation)({ summary: 'Получить трансформаторы по производителю' }),
    (0, swagger_1.ApiParam)({ name: 'manufacturer', type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, type: [transformer_entity_1.Transformer] }),
    __param(0, (0, common_1.Param)('manufacturer')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TransformersController.prototype, "findByManufacturer", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Получить трансформатор по ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, type: transformer_entity_1.Transformer }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], TransformersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.PTO),
    (0, swagger_1.ApiOperation)({ summary: 'Обновить трансформатор' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, type: transformer_entity_1.Transformer }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_transformer_dto_1.UpdateTransformerDto]),
    __metadata("design:returntype", void 0)
], TransformersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.PTO),
    (0, swagger_1.ApiOperation)({ summary: 'Удалить трансформатор' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], TransformersController.prototype, "remove", null);
exports.TransformersController = TransformersController = __decorate([
    (0, swagger_1.ApiTags)('Трансформаторы'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('transformers'),
    __metadata("design:paramtypes", [transformers_service_1.TransformersService])
], TransformersController);
//# sourceMappingURL=transformers.controller.js.map