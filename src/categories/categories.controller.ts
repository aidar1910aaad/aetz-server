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
} from '@nestjs/swagger';

@ApiTags('Categories')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.PTO)
  @ApiOperation({ summary: 'Создать одну или несколько категорий' })
  @ApiResponse({ status: 201, description: 'Категория(и) успешно созданы' })
  create(@Body() dto: CreateCategoryDto | CreateCategoryDto[]) {
    if (Array.isArray(dto)) {
      return Promise.all(dto.map((item) => this.categoriesService.create(item)));
    }
    return this.categoriesService.create(dto);
  }
  

  @Get()
  @ApiOperation({ summary: 'Получить все категории' })
  @ApiResponse({ status: 200, description: 'Список категорий' })
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить категорию по ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Категория найдена' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.PTO)
  @ApiOperation({ summary: 'Обновить категорию по ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Категория обновлена' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCategoryDto) {
    return this.categoriesService.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.PTO)
  @ApiOperation({ summary: 'Удалить категорию по ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Категория удалена' })
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
}
