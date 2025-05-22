import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { CalculationsService } from './calculations.service';
import { CreateCalculationDto } from './dto/create-calculation.dto';
import { CreateCalculationGroupDto } from './dto/create-calculation-group.dto';
import { UpdateCalculationDto } from './dto/update-calculation.dto';
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

@ApiTags('Calculations')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('calculations')
export class CalculationsController {
  constructor(private readonly calculationsService: CalculationsService) { }

  // ✅ Создание группы
  @Post('groups')
  @Roles(UserRole.ADMIN, UserRole.PTO)
  @ApiOperation({ summary: 'Создать группу калькуляций' })
  @ApiResponse({ status: 201, type: CalculationGroup })
  createGroup(@Body() dto: CreateCalculationGroupDto) {
    return this.calculationsService.createGroup(dto);
  }

  // ✅ Получение всех групп
  @Get('groups')
  @ApiOperation({ summary: 'Получить список всех групп калькуляций' })
  @ApiResponse({ status: 200, type: [CalculationGroup] })
  getAllGroups() {
    return this.calculationsService.getAllGroups();
  }

  // ✅ Создание калькуляции
  @Post()
  @Roles(UserRole.ADMIN, UserRole.PTO)
  @ApiOperation({ summary: 'Создать калькуляцию в группе' })
  @ApiResponse({ status: 201, type: Calculation })
  createCalculation(@Body() dto: CreateCalculationDto) {
    return this.calculationsService.createCalculation(dto);
  }

  // ✅ Получить все калькуляции по группе
  @Get('groups/:slug/calculations')
  @ApiOperation({ summary: 'Получить список калькуляций в группе' })
  @ApiParam({ name: 'slug', type: String })
  @ApiResponse({ status: 200, type: [Calculation] })
  getGroupCalculations(@Param('slug') slug: string) {
    return this.calculationsService.getCalculationsByGroupSlug(slug);
  }

  // ✅ Получить конкретную калькуляцию по slugs
  @Get(':groupSlug/:calcSlug')
  @ApiOperation({ summary: 'Получить конкретную калькуляцию по slug группы и калькуляции' })
  @ApiParam({ name: 'groupSlug', type: String })
  @ApiParam({ name: 'calcSlug', type: String })
  @ApiResponse({ status: 200, type: Calculation })
  getOne(
    @Param('groupSlug') groupSlug: string,
    @Param('calcSlug') calcSlug: string,
  ) {
    return this.calculationsService.getCalculation(groupSlug, calcSlug);
  }

  // ✅ Обновление калькуляции
  @Patch(':groupSlug/:calcSlug')
  @Roles(UserRole.ADMIN, UserRole.PTO)
  @ApiOperation({
    summary: 'Обновить калькуляцию',
    description: 'Обновляет калькуляцию. Можно отправить как полные данные, так и только измененные части. Все поля являются необязательными.'
  })
  @ApiParam({
    name: 'groupSlug',
    type: String,
    description: 'Slug группы калькуляций'
  })
  @ApiParam({
    name: 'calcSlug',
    type: String,
    description: 'Slug калькуляции'
  })
  @ApiResponse({
    status: 200,
    type: Calculation,
    description: 'Возвращает обновленную калькуляцию с актуальными ценами материалов'
  })
  updateCalculation(
    @Param('groupSlug') groupSlug: string,
    @Param('calcSlug') calcSlug: string,
    @Body() dto: UpdateCalculationDto,
  ) {
    return this.calculationsService.updateCalculation(groupSlug, calcSlug, dto);
  }
}
