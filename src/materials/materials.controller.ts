import {
  Controller, Get, Post, Body, Param, Patch, UseGuards, ParseIntPipe, Delete,
} from '@nestjs/common';
import { MaterialsService } from './materials.service';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Materials')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('materials')
export class MaterialsController {
  constructor(private readonly materialsService: MaterialsService) {}

  @Post()
  @ApiOperation({ summary: 'Создание нового материала' })
  @ApiResponse({ status: 201, description: 'Материал успешно создан' })
  create(@Body() dto: CreateMaterialDto) {
    return this.materialsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить список всех материалов' })
  @ApiResponse({ status: 200, description: 'Успешно' })
  findAll() {
    return this.materialsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить материал по ID' })
  @ApiResponse({ status: 200, description: 'Успешно' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.materialsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить материал и сохранить историю изменений' })
  @ApiResponse({ status: 200, description: 'Успешно обновлён' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMaterialDto,
  ) {
    return this.materialsService.update(id, dto);
  }

  @Get(':id/history')
  @ApiOperation({ summary: 'Получить историю изменений материала' })
  @ApiResponse({ status: 200, description: 'История изменений' })
  getHistory(@Param('id', ParseIntPipe) id: number) {
    return this.materialsService.getHistory(id);
  }
  @Delete(':id')
  @ApiOperation({ summary: 'Удалить материал' })
  @ApiResponse({ status: 200, description: 'Материал успешно удалён' })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.materialsService.delete(id);
}

}
