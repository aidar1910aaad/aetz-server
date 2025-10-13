import { applyDecorators } from '@nestjs/common';
import { ApiResponse, ApiOperation } from '@nestjs/swagger';
import { 
  ErrorResponseSchema, 
  UnauthorizedResponseSchema, 
  ForbiddenResponseSchema, 
  NotFoundResponseSchema 
} from '../schemas/swagger-schemas';

// Общие декораторы для стандартных ответов API

export function ApiStandardResponses() {
  return applyDecorators(
    ApiResponse({ status: 400, description: 'Некорректные данные', type: ErrorResponseSchema }),
    ApiResponse({ status: 401, description: 'Не авторизован', type: UnauthorizedResponseSchema }),
    ApiResponse({ status: 403, description: 'Недостаточно прав', type: ForbiddenResponseSchema }),
    ApiResponse({ status: 404, description: 'Ресурс не найден', type: NotFoundResponseSchema }),
  );
}

export function ApiAuthResponses() {
  return applyDecorators(
    ApiResponse({ status: 401, description: 'Не авторизован', type: UnauthorizedResponseSchema }),
    ApiResponse({ status: 403, description: 'Недостаточно прав', type: ForbiddenResponseSchema }),
  );
}

export function ApiOperationWithDescription(summary: string, description: string) {
  return applyDecorators(
    ApiOperation({ 
      summary, 
      description 
    })
  );
}

// Декоратор для операций создания
export function ApiCreateOperation(entityName: string) {
  return applyDecorators(
    ApiOperationWithDescription(
      `Создать ${entityName.toLowerCase()}`,
      `Создает новый ${entityName.toLowerCase()} в системе`
    ),
    ApiStandardResponses()
  );
}

// Декоратор для операций получения списка
export function ApiGetAllOperation(entityName: string) {
  return applyDecorators(
    ApiOperationWithDescription(
      `Получить список ${entityName.toLowerCase()}`,
      `Возвращает список всех ${entityName.toLowerCase()} с возможностью фильтрации и пагинации`
    ),
    ApiAuthResponses()
  );
}

// Декоратор для операций получения по ID
export function ApiGetOneOperation(entityName: string) {
  return applyDecorators(
    ApiOperationWithDescription(
      `Получить ${entityName.toLowerCase()} по ID`,
      `Возвращает детальную информацию о конкретном ${entityName.toLowerCase()} по его уникальному идентификатору`
    ),
    ApiStandardResponses()
  );
}

// Декоратор для операций обновления
export function ApiUpdateOperation(entityName: string) {
  return applyDecorators(
    ApiOperationWithDescription(
      `Обновить ${entityName.toLowerCase()}`,
      `Обновляет существующий ${entityName.toLowerCase()} в системе`
    ),
    ApiStandardResponses()
  );
}

// Декоратор для операций удаления
export function ApiDeleteOperation(entityName: string) {
  return applyDecorators(
    ApiOperationWithDescription(
      `Удалить ${entityName.toLowerCase()}`,
      `Безвозвратно удаляет ${entityName.toLowerCase()} из системы. Внимание: данная операция необратима!`
    ),
    ApiStandardResponses()
  );
}

