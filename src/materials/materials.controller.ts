import {
  Controller, Get, Post, Body, Param, Patch, UseGuards, ParseIntPipe, Delete,
} from '@nestjs/common';
import { MaterialsService } from './materials.service';
import { Material } from './entities/material.entity';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { Query } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@ApiTags('Materials')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('materials')
export class MaterialsController {
  constructor(private readonly materialsService: MaterialsService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Создание нового материала',
    description: 'Создает новый материал в системе с указанными параметрами. Материал будет доступен для использования в расчетах и заявках.'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Материал успешно создан',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        name: { type: 'string', example: 'Вакуумный выключатель AV-24 1250A' },
        code: { type: 'string', example: '10000009398' },
        unit: { type: 'string', example: 'шт' },
        price: { type: 'number', example: 1610000 },
        category: { 
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            name: { type: 'string', example: 'Выключатели' }
          }
        },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  create(@Body() dto: CreateMaterialDto, @CurrentUser() user: JwtPayload) {
    return this.materialsService.create(dto, user?.username);
  }

  @Post('bulk')
  @ApiOperation({ 
    summary: 'Массовый импорт материалов',
    description: 'Импортирует массив материалов в систему. Полезно для загрузки большого количества материалов из файлов или других систем.'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Материалы успешно добавлены',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          name: { type: 'string', example: 'Вакуумный выключатель AV-24 1250A' },
          code: { type: 'string', example: '10000009398' },
          unit: { type: 'string', example: 'шт' },
          price: { type: 'number', example: 1610000 }
        }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  createMany(@Body() dtos: CreateMaterialDto[], @CurrentUser() user: JwtPayload): Promise<Material[]> {
    return this.materialsService.createMany(dtos, user?.username);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Получить список материалов с фильтрацией',
    description: 'Возвращает список всех материалов с возможностью фильтрации, сортировки и пагинации. Поддерживает поиск по названию и коду материала.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Список материалов получен успешно',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              name: { type: 'string', example: 'Вакуумный выключатель AV-24 1250A' },
              code: { type: 'string', example: '10000009398' },
              unit: { type: 'string', example: 'шт' },
              price: { type: 'number', example: 1610000 },
              category: { 
                type: 'object',
                properties: {
                  id: { type: 'number', example: 1 },
                  name: { type: 'string', example: 'Выключатели' }
                }
              }
            }
          }
        },
        total: { type: 'number', example: 150 }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('sort') sort?: 'name' | 'price' | 'code',
    @Query('order') order?: 'ASC' | 'DESC',
    @Query('categoryId') categoryId?: number,
  ) {
    return this.materialsService.findAll({ page, limit, search, sort, order, categoryId });
  }

  @Get('history')
  @ApiOperation({ 
    summary: 'Получить историю изменений материалов с фильтрацией',
    description: 'Возвращает историю изменений материалов с возможностью фильтрации по материалу, полю, пользователю, дате и поиска. Поддерживает пагинацию.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'История изменений материалов с пагинацией',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              fieldChanged: { type: 'string' },
              oldValue: { type: 'string' },
              newValue: { type: 'string' },
              changedBy: { type: 'string' },
              changedAt: { type: 'string', format: 'date-time' },
              material: {
                type: 'object',
                properties: {
                  id: { type: 'number' },
                  name: { type: 'string' },
                  code: { type: 'string' },
                  unit: { type: 'string' },
                  price: { type: 'number' },
                  category: { type: 'object' }
                }
              }
            }
          }
        },
        total: { type: 'number', description: 'Общее количество записей' }
      }
    }
  })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Номер страницы (по умолчанию: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Количество записей на странице (по умолчанию: 50)' })
  @ApiQuery({ name: 'materialId', required: false, type: Number, description: 'Фильтр по ID материала' })
  @ApiQuery({ name: 'fieldChanged', required: false, type: String, description: 'Фильтр по измененному полю (name, price, category, unit)' })
  @ApiQuery({ name: 'changedBy', required: false, type: String, description: 'Фильтр по имени пользователя (частичное совпадение)' })
  @ApiQuery({ name: 'dateFrom', required: false, type: String, description: 'Фильтр по дате начала (формат: YYYY-MM-DD или ISO)' })
  @ApiQuery({ name: 'dateTo', required: false, type: String, description: 'Фильтр по дате конца (формат: YYYY-MM-DD или ISO)' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Поиск по названию или коду материала' })
  getRecentHistory(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('materialId') materialId?: number,
    @Query('fieldChanged') fieldChanged?: string,
    @Query('changedBy') changedBy?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
    @Query('search') search?: string,
  ) {
    return this.materialsService.getRecentHistory({
      page: page ? +page : undefined,
      limit: limit ? +limit : undefined,
      materialId: materialId ? +materialId : undefined,
      fieldChanged,
      changedBy,
      dateFrom,
      dateTo,
      search,
    });
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Получить материал по ID',
    description: 'Возвращает детальную информацию о конкретном материале по его уникальному идентификатору.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Материал найден',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        name: { type: 'string', example: 'Вакуумный выключатель AV-24 1250A' },
        code: { type: 'string', example: '10000009398' },
        unit: { type: 'string', example: 'шт' },
        price: { type: 'number', example: 1610000 },
        category: { 
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            name: { type: 'string', example: 'Выключатели' }
          }
        },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Материал не найден' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.materialsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Обновить материал',
    description: 'Обновляет существующий материал и автоматически сохраняет историю всех изменений для аудита.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Материал успешно обновлен',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        name: { type: 'string', example: 'Вакуумный выключатель AV-24 1250A' },
        code: { type: 'string', example: '10000009398' },
        unit: { type: 'string', example: 'шт' },
        price: { type: 'number', example: 1610000 },
        category: { 
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            name: { type: 'string', example: 'Выключатели' }
          }
        },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Материал не найден' })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateMaterialDto, @CurrentUser() user: JwtPayload) {
    return this.materialsService.update(id, dto, user?.username);
  }

  @Get(':id/history')
  @ApiOperation({ 
    summary: 'Получить историю изменений конкретного материала',
    description: 'Возвращает полную историю всех изменений конкретного материала, включая информацию о том, кто и когда вносил изменения.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'История изменений материала получена',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          fieldChanged: { type: 'string', example: 'price' },
          oldValue: { type: 'string', example: '1500000' },
          newValue: { type: 'string', example: '1610000' },
          changedBy: { type: 'string', example: 'admin' },
          changedAt: { type: 'string', format: 'date-time' },
          material: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              name: { type: 'string', example: 'Вакуумный выключатель AV-24 1250A' }
            }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Материал не найден' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  getHistory(@Param('id', ParseIntPipe) id: number) {
    return this.materialsService.getHistory(id);
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Удалить материал',
    description: 'Безвозвратно удаляет материал из системы. Внимание: данная операция необратима!'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Материал успешно удален',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Материал успешно удален' }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Материал не найден' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав для удаления' })
  delete(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: JwtPayload) {
    return this.materialsService.delete(id, user?.username);
  }
}
