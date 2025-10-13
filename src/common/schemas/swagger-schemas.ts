import { ApiProperty } from '@nestjs/swagger';

// Общие схемы для Swagger документации

export class ErrorResponseSchema {
  @ApiProperty({
    example: 400,
    description: 'HTTP статус код ошибки'
  })
  statusCode: number;

  @ApiProperty({
    example: 'Некорректные данные',
    description: 'Описание ошибки'
  })
  message: string;

  @ApiProperty({
    example: 'Bad Request',
    description: 'Тип ошибки'
  })
  error: string;
}

export class UnauthorizedResponseSchema {
  @ApiProperty({
    example: 401,
    description: 'HTTP статус код'
  })
  statusCode: number;

  @ApiProperty({
    example: 'Не авторизован',
    description: 'Сообщение об ошибке авторизации'
  })
  message: string;
}

export class ForbiddenResponseSchema {
  @ApiProperty({
    example: 403,
    description: 'HTTP статус код'
  })
  statusCode: number;

  @ApiProperty({
    example: 'Недостаточно прав доступа',
    description: 'Сообщение об ошибке доступа'
  })
  message: string;
}

export class NotFoundResponseSchema {
  @ApiProperty({
    example: 404,
    description: 'HTTP статус код'
  })
  statusCode: number;

  @ApiProperty({
    example: 'Ресурс не найден',
    description: 'Сообщение об ошибке'
  })
  message: string;
}

export class PaginationSchema {
  @ApiProperty({
    example: 1,
    description: 'Номер страницы'
  })
  page: number;

  @ApiProperty({
    example: 10,
    description: 'Количество элементов на странице'
  })
  limit: number;

  @ApiProperty({
    example: 100,
    description: 'Общее количество элементов'
  })
  total: number;
}

export class SuccessMessageSchema {
  @ApiProperty({
    example: 'Операция выполнена успешно',
    description: 'Сообщение об успешном выполнении'
  })
  message: string;
}

export class MaterialSchema {
  @ApiProperty({
    example: 1,
    description: 'Уникальный идентификатор материала'
  })
  id: number;

  @ApiProperty({
    example: 'Вакуумный выключатель AV-24 1250A',
    description: 'Название материала'
  })
  name: string;

  @ApiProperty({
    example: '10000009398',
    description: 'Код материала',
    required: false
  })
  code?: string;

  @ApiProperty({
    example: 'шт',
    description: 'Единица измерения'
  })
  unit: string;

  @ApiProperty({
    example: 1610000,
    description: 'Цена без НДС'
  })
  price: number;

  @ApiProperty({
    example: '2024-01-15T10:30:00Z',
    description: 'Дата создания',
    format: 'date-time'
  })
  createdAt: string;

  @ApiProperty({
    example: '2024-01-15T10:30:00Z',
    description: 'Дата последнего обновления',
    format: 'date-time'
  })
  updatedAt: string;
}

export class CategorySchema {
  @ApiProperty({
    example: 1,
    description: 'Уникальный идентификатор категории'
  })
  id: number;

  @ApiProperty({
    example: 'Выключатели',
    description: 'Название категории'
  })
  name: string;

  @ApiProperty({
    example: 'Категория для выключателей',
    description: 'Описание категории',
    required: false
  })
  description?: string;
}

export class UserSchema {
  @ApiProperty({
    example: 1,
    description: 'Уникальный идентификатор пользователя'
  })
  id: number;

  @ApiProperty({
    example: 'admin',
    description: 'Имя пользователя'
  })
  username: string;

  @ApiProperty({
    example: 'ADMIN',
    description: 'Роль пользователя',
    enum: ['ADMIN', 'PTO', 'USER']
  })
  role: string;

  @ApiProperty({
    example: '2024-01-15T10:30:00Z',
    description: 'Дата создания',
    format: 'date-time'
  })
  createdAt: string;

  @ApiProperty({
    example: '2024-01-15T10:30:00Z',
    description: 'Дата последнего обновления',
    format: 'date-time'
  })
  updatedAt: string;
}

export class MaterialHistorySchema {
  @ApiProperty({
    example: 1,
    description: 'Уникальный идентификатор записи истории'
  })
  id: number;

  @ApiProperty({
    example: 'price',
    description: 'Название измененного поля'
  })
  fieldChanged: string;

  @ApiProperty({
    example: '1500000',
    description: 'Старое значение'
  })
  oldValue: string;

  @ApiProperty({
    example: '1610000',
    description: 'Новое значение'
  })
  newValue: string;

  @ApiProperty({
    example: 'admin',
    description: 'Пользователь, который внес изменения'
  })
  changedBy: string;

  @ApiProperty({
    example: '2024-01-15T10:30:00Z',
    description: 'Дата и время изменения',
    format: 'date-time'
  })
  changedAt: string;
}

