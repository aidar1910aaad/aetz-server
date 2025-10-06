"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiStandardResponses = ApiStandardResponses;
exports.ApiAuthResponses = ApiAuthResponses;
exports.ApiOperationWithDescription = ApiOperationWithDescription;
exports.ApiCreateOperation = ApiCreateOperation;
exports.ApiGetAllOperation = ApiGetAllOperation;
exports.ApiGetOneOperation = ApiGetOneOperation;
exports.ApiUpdateOperation = ApiUpdateOperation;
exports.ApiDeleteOperation = ApiDeleteOperation;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const swagger_schemas_1 = require("../schemas/swagger-schemas");
function ApiStandardResponses() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiResponse)({ status: 400, description: 'Некорректные данные', type: swagger_schemas_1.ErrorResponseSchema }), (0, swagger_1.ApiResponse)({ status: 401, description: 'Не авторизован', type: swagger_schemas_1.UnauthorizedResponseSchema }), (0, swagger_1.ApiResponse)({ status: 403, description: 'Недостаточно прав', type: swagger_schemas_1.ForbiddenResponseSchema }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Ресурс не найден', type: swagger_schemas_1.NotFoundResponseSchema }));
}
function ApiAuthResponses() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiResponse)({ status: 401, description: 'Не авторизован', type: swagger_schemas_1.UnauthorizedResponseSchema }), (0, swagger_1.ApiResponse)({ status: 403, description: 'Недостаточно прав', type: swagger_schemas_1.ForbiddenResponseSchema }));
}
function ApiOperationWithDescription(summary, description) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({
        summary,
        description
    }));
}
function ApiCreateOperation(entityName) {
    return (0, common_1.applyDecorators)(ApiOperationWithDescription(`Создать ${entityName.toLowerCase()}`, `Создает новый ${entityName.toLowerCase()} в системе`), ApiStandardResponses());
}
function ApiGetAllOperation(entityName) {
    return (0, common_1.applyDecorators)(ApiOperationWithDescription(`Получить список ${entityName.toLowerCase()}`, `Возвращает список всех ${entityName.toLowerCase()} с возможностью фильтрации и пагинации`), ApiAuthResponses());
}
function ApiGetOneOperation(entityName) {
    return (0, common_1.applyDecorators)(ApiOperationWithDescription(`Получить ${entityName.toLowerCase()} по ID`, `Возвращает детальную информацию о конкретном ${entityName.toLowerCase()} по его уникальному идентификатору`), ApiStandardResponses());
}
function ApiUpdateOperation(entityName) {
    return (0, common_1.applyDecorators)(ApiOperationWithDescription(`Обновить ${entityName.toLowerCase()}`, `Обновляет существующий ${entityName.toLowerCase()} в системе`), ApiStandardResponses());
}
function ApiDeleteOperation(entityName) {
    return (0, common_1.applyDecorators)(ApiOperationWithDescription(`Удалить ${entityName.toLowerCase()}`, `Безвозвратно удаляет ${entityName.toLowerCase()} из системы. Внимание: данная операция необратима!`), ApiStandardResponses());
}
//# sourceMappingURL=swagger.decorators.js.map