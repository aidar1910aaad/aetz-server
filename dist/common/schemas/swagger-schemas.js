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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaterialHistorySchema = exports.UserSchema = exports.CategorySchema = exports.MaterialSchema = exports.SuccessMessageSchema = exports.PaginationSchema = exports.NotFoundResponseSchema = exports.ForbiddenResponseSchema = exports.UnauthorizedResponseSchema = exports.ErrorResponseSchema = void 0;
const swagger_1 = require("@nestjs/swagger");
class ErrorResponseSchema {
}
exports.ErrorResponseSchema = ErrorResponseSchema;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 400,
        description: 'HTTP статус код ошибки'
    }),
    __metadata("design:type", Number)
], ErrorResponseSchema.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Некорректные данные',
        description: 'Описание ошибки'
    }),
    __metadata("design:type", String)
], ErrorResponseSchema.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Bad Request',
        description: 'Тип ошибки'
    }),
    __metadata("design:type", String)
], ErrorResponseSchema.prototype, "error", void 0);
class UnauthorizedResponseSchema {
}
exports.UnauthorizedResponseSchema = UnauthorizedResponseSchema;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 401,
        description: 'HTTP статус код'
    }),
    __metadata("design:type", Number)
], UnauthorizedResponseSchema.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Не авторизован',
        description: 'Сообщение об ошибке авторизации'
    }),
    __metadata("design:type", String)
], UnauthorizedResponseSchema.prototype, "message", void 0);
class ForbiddenResponseSchema {
}
exports.ForbiddenResponseSchema = ForbiddenResponseSchema;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 403,
        description: 'HTTP статус код'
    }),
    __metadata("design:type", Number)
], ForbiddenResponseSchema.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Недостаточно прав доступа',
        description: 'Сообщение об ошибке доступа'
    }),
    __metadata("design:type", String)
], ForbiddenResponseSchema.prototype, "message", void 0);
class NotFoundResponseSchema {
}
exports.NotFoundResponseSchema = NotFoundResponseSchema;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 404,
        description: 'HTTP статус код'
    }),
    __metadata("design:type", Number)
], NotFoundResponseSchema.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Ресурс не найден',
        description: 'Сообщение об ошибке'
    }),
    __metadata("design:type", String)
], NotFoundResponseSchema.prototype, "message", void 0);
class PaginationSchema {
}
exports.PaginationSchema = PaginationSchema;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1,
        description: 'Номер страницы'
    }),
    __metadata("design:type", Number)
], PaginationSchema.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 10,
        description: 'Количество элементов на странице'
    }),
    __metadata("design:type", Number)
], PaginationSchema.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 100,
        description: 'Общее количество элементов'
    }),
    __metadata("design:type", Number)
], PaginationSchema.prototype, "total", void 0);
class SuccessMessageSchema {
}
exports.SuccessMessageSchema = SuccessMessageSchema;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Операция выполнена успешно',
        description: 'Сообщение об успешном выполнении'
    }),
    __metadata("design:type", String)
], SuccessMessageSchema.prototype, "message", void 0);
class MaterialSchema {
}
exports.MaterialSchema = MaterialSchema;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1,
        description: 'Уникальный идентификатор материала'
    }),
    __metadata("design:type", Number)
], MaterialSchema.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Вакуумный выключатель AV-24 1250A',
        description: 'Название материала'
    }),
    __metadata("design:type", String)
], MaterialSchema.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '10000009398',
        description: 'Код материала',
        required: false
    }),
    __metadata("design:type", String)
], MaterialSchema.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'шт',
        description: 'Единица измерения'
    }),
    __metadata("design:type", String)
], MaterialSchema.prototype, "unit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1610000,
        description: 'Цена без НДС'
    }),
    __metadata("design:type", Number)
], MaterialSchema.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2024-01-15T10:30:00Z',
        description: 'Дата создания',
        format: 'date-time'
    }),
    __metadata("design:type", String)
], MaterialSchema.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2024-01-15T10:30:00Z',
        description: 'Дата последнего обновления',
        format: 'date-time'
    }),
    __metadata("design:type", String)
], MaterialSchema.prototype, "updatedAt", void 0);
class CategorySchema {
}
exports.CategorySchema = CategorySchema;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1,
        description: 'Уникальный идентификатор категории'
    }),
    __metadata("design:type", Number)
], CategorySchema.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Выключатели',
        description: 'Название категории'
    }),
    __metadata("design:type", String)
], CategorySchema.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Категория для выключателей',
        description: 'Описание категории',
        required: false
    }),
    __metadata("design:type", String)
], CategorySchema.prototype, "description", void 0);
class UserSchema {
}
exports.UserSchema = UserSchema;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1,
        description: 'Уникальный идентификатор пользователя'
    }),
    __metadata("design:type", Number)
], UserSchema.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'admin',
        description: 'Имя пользователя'
    }),
    __metadata("design:type", String)
], UserSchema.prototype, "username", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'ADMIN',
        description: 'Роль пользователя',
        enum: ['ADMIN', 'PTO', 'USER']
    }),
    __metadata("design:type", String)
], UserSchema.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2024-01-15T10:30:00Z',
        description: 'Дата создания',
        format: 'date-time'
    }),
    __metadata("design:type", String)
], UserSchema.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2024-01-15T10:30:00Z',
        description: 'Дата последнего обновления',
        format: 'date-time'
    }),
    __metadata("design:type", String)
], UserSchema.prototype, "updatedAt", void 0);
class MaterialHistorySchema {
}
exports.MaterialHistorySchema = MaterialHistorySchema;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1,
        description: 'Уникальный идентификатор записи истории'
    }),
    __metadata("design:type", Number)
], MaterialHistorySchema.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'price',
        description: 'Название измененного поля'
    }),
    __metadata("design:type", String)
], MaterialHistorySchema.prototype, "fieldChanged", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '1500000',
        description: 'Старое значение'
    }),
    __metadata("design:type", String)
], MaterialHistorySchema.prototype, "oldValue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '1610000',
        description: 'Новое значение'
    }),
    __metadata("design:type", String)
], MaterialHistorySchema.prototype, "newValue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'admin',
        description: 'Пользователь, который внес изменения'
    }),
    __metadata("design:type", String)
], MaterialHistorySchema.prototype, "changedBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2024-01-15T10:30:00Z',
        description: 'Дата и время изменения',
        format: 'date-time'
    }),
    __metadata("design:type", String)
], MaterialHistorySchema.prototype, "changedAt", void 0);
//# sourceMappingURL=swagger-schemas.js.map