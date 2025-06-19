import {
  Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Material } from '../materials/entities/material.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { Category } from './entities/category.entity';

@ApiTags('Категории')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.PTO)
  @ApiOperation({ 
    summary: 'Создать категорию',
    description: 'Создает новую категорию материалов. Требуются права администратора или PTO.'
  })
  @ApiBody({ 
    type: CreateCategoryDto,
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
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Категория успешно создана',
    type: Category
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Неверные входные данные'
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Не авторизован'
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Нет прав доступа'
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Категория с таким ID уже существует'
  })
  create(@Body() dto: CreateCategoryDto | CreateCategoryDto[]) {
    if (Array.isArray(dto)) {
      return Promise.all(dto.map((item) => this.categoriesService.create(item)));
    }
    return this.categoriesService.create(dto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Получить все категории',
    description: 'Возвращает список всех категорий материалов'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Список категорий успешно получен',
    type: [Category]
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Не авторизован'
  })
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Получить категорию по ID',
    description: 'Возвращает категорию по её уникальному идентификатору'
  })
  @ApiParam({ 
    name: 'id', 
    type: Number,
    description: 'ID категории',
    example: 1
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Категория успешно найдена',
    type: Category
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Не авторизован'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Категория не найдена'
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.PTO)
  @ApiOperation({ 
    summary: 'Обновить категорию',
    description: 'Обновляет существующую категорию. Требуются права администратора или PTO.'
  })
  @ApiParam({ 
    name: 'id', 
    type: Number,
    description: 'ID категории',
    example: 1
  })
  @ApiBody({ 
    type: UpdateCategoryDto,
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
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Категория успешно обновлена',
    type: Category
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Неверные входные данные'
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Не авторизован'
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Нет прав доступа'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Категория не найдена'
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ 
    summary: 'Удалить категорию',
    description: 'Удаляет категорию и все связанные с ней материалы. Требуются права администратора.'
  })
  @ApiParam({ 
    name: 'id', 
    type: Number,
    description: 'ID категории',
    example: 1
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Категория успешно удалена'
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Не авторизован'
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Нет прав доступа'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Категория не найдена'
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.remove(id);
  }

  @Get(':id/materials')
  @ApiOperation({ summary: 'Получить все материалы по категории' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Список материалов', type: [Material] })
  async getMaterialsByCategory(@Param('id', ParseIntPipe) id: number): Promise<Material[]> {
    return this.categoriesService.findMaterialsByCategoryId(id);
  }

  @Delete('batch')
  @Roles(UserRole.ADMIN, UserRole.PTO)
  @ApiOperation({ summary: 'Удалить несколько категорий по ID' })
  @ApiResponse({ status: 200, description: 'Категории удалены' })
  removeMany(@Body() ids: number[]) {
    return this.categoriesService.removeMany(ids);
  }
}
