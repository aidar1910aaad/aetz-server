import {
    Controller, Post, Body, Get, Param, Patch
  } from '@nestjs/common';
  import { CalculationsService } from './calculations.service';
  import { CreateCalculationDto } from './dto/create-calculation.dto';
  import { UpdateStatusDto } from './dto/update-status.dto';
  import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
  import { UpdateCalculationDto } from './dto/update-calculation.dto';

@ApiTags('Calculations')
@Controller('calculations')
export class CalculationsController {
  constructor(private readonly service: CalculationsService) {}

  @Post()
  @ApiOperation({ summary: 'Создать новую калькуляцию' })
  create(@Body() dto: CreateCalculationDto) {
    return this.service.create(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить одну калькуляцию с позициями' })
  @ApiParam({ name: 'id', example: 1 })
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Изменить статус калькуляции' })
  updateStatus(@Param('id') id: string, @Body() dto: UpdateStatusDto) {
    return this.service.updateStatus(+id, dto);
  }

  @Get(':id/logs')
  @ApiOperation({ summary: 'Получить историю изменений калькуляции' })
  getLogs(@Param('id') id: string) {
    return this.service.getLogs(+id);
  }

  @Patch(':id')
@ApiOperation({ summary: 'Обновить калькуляцию (название и/или позиции)' })
update(@Param('id') id: string, @Body() dto: UpdateCalculationDto) {
  return this.service.update(+id, dto);
}
}

  