import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Patch,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { CalculationsService } from './calculations.service';
import { CreateCalculationDto } from './dto/create-calculation.dto';
import { CreateCalculationGroupDto } from './dto/create-calculation-group.dto';
import { UpdateCalculationDto } from './dto/update-calculation.dto';
import { UpdateCalculationGroupDto } from './dto/update-calculation-group.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { Calculation } from './entities/calculation.entity';
import { CalculationGroup } from './entities/calculation-group.entity';

@ApiTags('Расчеты')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('calculations')
export class CalculationsController {
  constructor(private readonly calculationsService: CalculationsService) {}

  // ✅ Получение всех групп
  @Get('groups')
  @ApiOperation({ 
    summary: 'Получить список всех групп расчетов',
    description: 'Возвращает список всех групп расчетов с их метаданными и настройками.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Список групп расчетов получен',
    type: [CalculationGroup],
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          name: { type: 'string', example: 'Электротехнические расчеты' },
          slug: { type: 'string', example: 'electrical-calculations' },
          description: { type: 'string', example: 'Расчеты для электротехнических проектов' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  getAllGroups() {
    return this.calculationsService.getAllGroups();
  }

  // ✅ Обновление группы
  @Patch('groups/:slug')
  @Roles(UserRole.ADMIN, UserRole.PTO)
  @ApiOperation({ summary: 'Обновить группу калькуляций' })
  @ApiParam({
    name: 'slug',
    type: String,
    description: 'Slug группы калькуляций',
  })
  @ApiResponse({
    status: 200,
    type: CalculationGroup,
    description: 'Группа успешно обновлена',
  })
  @ApiResponse({ status: 404, description: 'Группа не найдена' })
  updateGroup(
    @Param('slug') slug: string,
    @Body() dto: UpdateCalculationGroupDto,
  ) {
    console.log('=== ОБНОВЛЕНИЕ ГРУППЫ ===');
    console.log('Slug:', slug);
    console.log('DTO:', JSON.stringify(dto, null, 2));
    console.log('DTO keys:', Object.keys(dto));
    return this.calculationsService.updateGroup(slug, dto);
  }

  // ✅ Создание калькуляции
  @Post()
  @Roles(UserRole.ADMIN, UserRole.PTO)
  @ApiOperation({ summary: 'Создать калькуляцию в группе' })
  @ApiResponse({ status: 201, type: Calculation })
  createCalculation(@Body() dto: CreateCalculationDto) {
    return this.calculationsService.createCalculation(dto);
  }

  // ✅ Создание группы
  @Post('groups')
  @Roles(UserRole.ADMIN, UserRole.PTO)
  @ApiOperation({ summary: 'Создать группу калькуляций' })
  @ApiResponse({ status: 201, type: CalculationGroup })
  createGroup(@Body() dto: CreateCalculationGroupDto) {
    return this.calculationsService.createGroup(dto);
  }

  // ✅ Получить все калькуляции из всех групп
  @Get('all')
  @ApiOperation({ summary: 'Получить список всех калькуляций из всех групп' })
  @ApiResponse({ status: 200, type: [Calculation] })
  getAllCalculations() {
    return this.calculationsService.getAllCalculations();
  }

  // Удалить группу калькуляций по ID
  @Delete('groups/:id')
  @Roles(UserRole.ADMIN, UserRole.PTO)
  @ApiOperation({ summary: 'Удалить группу калькуляций по ID' })
  @ApiParam({ name: 'id', description: 'ID группы калькуляций', type: Number })
  @ApiResponse({ status: 200, description: 'Группа успешно удалена' })
  @ApiResponse({ status: 404, description: 'Группа не найдена' })
  async deleteGroupById(@Param('id', ParseIntPipe) id: number): Promise<void> {
    console.log('=== КОНТРОЛЛЕР: УДАЛЕНИЕ ГРУППЫ ===');
    console.log('Получен запрос на удаление группы с ID:', id, 'тип:', typeof id);
    return this.calculationsService.deleteGroupById(id);
  }

  // ✅ Получить конкретную калькуляцию по slugs
  @Get(':groupSlug/:calcSlug')
  @ApiOperation({
    summary: 'Получить конкретную калькуляцию по slug группы и калькуляции',
  })
  @ApiParam({
    name: 'groupSlug',
    type: String,
    description: 'Slug группы калькуляции',
  })
  @ApiParam({ name: 'calcSlug', type: String })
  @ApiResponse({ status: 200, type: Calculation })
  getOne(
    @Param('groupSlug') groupSlug: string,
    @Param('calcSlug') calcSlug: string,
  ) {
    return this.calculationsService.getCalculation(groupSlug, calcSlug);
  }

  // ✅ Получить все калькуляции по группе
  @Get('groups/:slug/calculations')
  @ApiOperation({ summary: 'Получить список калькуляций в группе' })
  @ApiParam({ name: 'slug', type: String })
  @ApiResponse({ status: 200, type: [Calculation] })
  getGroupCalculations(@Param('slug') slug: string) {
    return this.calculationsService.getCalculationsByGroupSlug(slug);
  }

  // ✅ Обновление калькуляции
  @Patch(':groupSlug/:calcSlug')
  @Roles(UserRole.ADMIN, UserRole.PTO)
  @ApiOperation({
    summary: 'Обновить калькуляцию',
    description:
      'Обновляет калькуляцию. Можно отправить как полные данные, так и только измененные части. Все поля являются необязательными.',
  })
  @ApiParam({
    name: 'groupSlug',
    type: String,
    description: 'Slug группы калькуляции',
  })
  @ApiParam({
    name: 'calcSlug',
    type: String,
    description: 'Slug калькуляции',
  })
  @ApiResponse({
    status: 200,
    type: Calculation,
    description:
      'Возвращает обновленную калькуляцию с актуальными ценами материалов',
  })
  updateCalculation(
    @Param('groupSlug') groupSlug: string,
    @Param('calcSlug') calcSlug: string,
    @Body() dto: UpdateCalculationDto,
  ) {
    return this.calculationsService.updateCalculation(groupSlug, calcSlug, dto);
  }

  // Удалить калькуляцию
  @Delete(':groupSlug/:calcSlug')
  @Roles(UserRole.ADMIN, UserRole.PTO)
  @ApiOperation({ summary: 'Удалить калькуляцию' })
  @ApiParam({
    name: 'groupSlug',
    type: String,
    description: 'Slug группы калькуляции',
  })
  @ApiParam({ name: 'calcSlug', type: String, description: 'Slug калькуляции' })
  @ApiResponse({ status: 200, description: 'Калькуляция успешно удалена' })
  @ApiResponse({ status: 404, description: 'Калькуляция не найдена' })
  deleteCalculation(
    @Param('groupSlug') groupSlug: string,
    @Param('calcSlug') calcSlug: string,
  ) {
    return this.calculationsService.deleteCalculation(groupSlug, calcSlug);
  }
}
