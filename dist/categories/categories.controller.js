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
exports.CategoriesController = void 0;
const common_1 = require("@nestjs/common");
const categories_service_1 = require("./categories.service");
const create_category_dto_1 = require("./dto/create-category.dto");
const update_category_dto_1 = require("./dto/update-category.dto");
const material_entity_1 = require("../materials/entities/material.entity");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const user_entity_1 = require("../users/entities/user.entity");
const swagger_1 = require("@nestjs/swagger");
const category_entity_1 = require("./entities/category.entity");
let CategoriesController = class CategoriesController {
    constructor(categoriesService) {
        this.categoriesService = categoriesService;
    }
    create(dto) {
        if (Array.isArray(dto)) {
            return Promise.all(dto.map((item) => this.categoriesService.create(item)));
        }
        return this.categoriesService.create(dto);
    }
    findAll() {
        return this.categoriesService.findAll();
    }
    findOne(id) {
        return this.categoriesService.findOne(id);
    }
    update(id, updateCategoryDto) {
        return this.categoriesService.update(id, updateCategoryDto);
    }
    remove(id) {
        return this.categoriesService.remove(id);
    }
    async getMaterialsByCategory(id) {
        return this.categoriesService.findMaterialsByCategoryId(id);
    }
    removeMany(ids) {
        return this.categoriesService.removeMany(ids);
    }
};
exports.CategoriesController = CategoriesController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.PTO),
    (0, swagger_1.ApiOperation)({
        summary: 'Создать категорию',
        description: 'Создает новую категорию материалов. Требуются права администратора или PTO.'
    }),
    (0, swagger_1.ApiBody)({
        type: create_category_dto_1.CreateCategoryDto,
        description: 'Данные для создания категории',
        examples: {
            single: {
                value: {
                    id: 1,
                    name: 'Электрооборудование',
                    description: 'Категория для электрооборудования'
                }
            },
            multiple: {
                value: [
                    {
                        id: 1,
                        name: 'Электрооборудование',
                        description: 'Категория для электрооборудования'
                    },
                    {
                        id: 2,
                        name: 'Кабельная продукция',
                        description: 'Категория для кабельной продукции'
                    }
                ]
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Категория успешно создана',
        type: category_entity_1.Category
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Неверные входные данные'
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Не авторизован'
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Нет прав доступа'
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'Категория с таким ID уже существует'
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CategoriesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Получить все категории',
        description: 'Возвращает список всех категорий материалов'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Список категорий успешно получен',
        type: [category_entity_1.Category]
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Не авторизован'
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CategoriesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Получить категорию по ID',
        description: 'Возвращает категорию по её уникальному идентификатору'
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        type: Number,
        description: 'ID категории',
        example: 1
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Категория успешно найдена',
        type: category_entity_1.Category
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Не авторизован'
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Категория не найдена'
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CategoriesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.PTO),
    (0, swagger_1.ApiOperation)({
        summary: 'Обновить категорию',
        description: 'Обновляет существующую категорию. Требуются права администратора или PTO.'
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        type: Number,
        description: 'ID категории',
        example: 1
    }),
    (0, swagger_1.ApiBody)({
        type: update_category_dto_1.UpdateCategoryDto,
        description: 'Данные для обновления категории',
        examples: {
            updateName: {
                value: {
                    name: 'Новое название категории'
                }
            },
            updateCode: {
                value: {
                    code: 'NEW_CODE'
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Категория успешно обновлена',
        type: category_entity_1.Category
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Неверные входные данные'
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Не авторизован'
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Нет прав доступа'
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Категория не найдена'
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_category_dto_1.UpdateCategoryDto]),
    __metadata("design:returntype", void 0)
], CategoriesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Удалить категорию',
        description: 'Удаляет категорию и все связанные с ней материалы. Требуются права администратора.'
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        type: Number,
        description: 'ID категории',
        example: 1
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Категория успешно удалена'
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Не авторизован'
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Нет прав доступа'
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Категория не найдена'
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CategoriesController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(':id/materials'),
    (0, swagger_1.ApiOperation)({ summary: 'Получить все материалы по категории' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Список материалов', type: [material_entity_1.Material] }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "getMaterialsByCategory", null);
__decorate([
    (0, common_1.Delete)('batch'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.PTO),
    (0, swagger_1.ApiOperation)({ summary: 'Удалить несколько категорий по ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Категории удалены' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", void 0)
], CategoriesController.prototype, "removeMany", null);
exports.CategoriesController = CategoriesController = __decorate([
    (0, swagger_1.ApiTags)('Категории'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('categories'),
    __metadata("design:paramtypes", [categories_service_1.CategoriesService])
], CategoriesController);
//# sourceMappingURL=categories.controller.js.map