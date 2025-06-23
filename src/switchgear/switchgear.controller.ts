import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SwitchgearService } from './switchgear.service';
import { CreateSwitchgearConfigDto } from './dto/create-switchgear-config.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { SwitchgearConfig } from './entities/switchgear-config.entity';

@ApiTags('Switchgear Configurations')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('switchgear')
export class SwitchgearController {
  constructor(private readonly switchgearService: SwitchgearService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.PTO)
  @ApiOperation({ summary: 'Создать новую конфигурацию ячеек РУ' })
  @ApiResponse({
    status: 201,
    description: 'Конфигурация успешно создана',
    type: SwitchgearConfig,
  })
  create(@Body() createSwitchgearConfigDto: CreateSwitchgearConfigDto) {
    return this.switchgearService.create(createSwitchgearConfigDto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить список конфигураций ячеек РУ' })
  @ApiQuery({ name: 'type', required: false, description: 'Фильтр по типу' })
  @ApiQuery({
    name: 'amperage',
    required: false,
    description: 'Фильтр по току',
  })
  @ApiQuery({ name: 'group', required: false, description: 'Фильтр по группе' })
  @ApiResponse({
    status: 200,
    description: 'Список конфигураций',
    type: [SwitchgearConfig],
  })
  findAll(
    @Query('type') type?: string,
    @Query('amperage') amperage?: number,
    @Query('group') group?: string,
  ) {
    return this.switchgearService.findAll({ type, amperage, group });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить конфигурацию по ID' })
  @ApiParam({ name: 'id', description: 'ID конфигурации' })
  @ApiResponse({
    status: 200,
    description: 'Конфигурация найдена',
    type: SwitchgearConfig,
  })
  @ApiResponse({ status: 404, description: 'Конфигурация не найдена' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.switchgearService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.PTO)
  @ApiOperation({ summary: 'Обновить конфигурацию' })
  @ApiParam({ name: 'id', description: 'ID конфигурации' })
  @ApiResponse({
    status: 200,
    description: 'Конфигурация обновлена',
    type: SwitchgearConfig,
  })
  @ApiResponse({ status: 404, description: 'Конфигурация не найдена' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSwitchgearConfigDto: CreateSwitchgearConfigDto,
  ) {
    return this.switchgearService.update(id, updateSwitchgearConfigDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.PTO)
  @ApiOperation({ summary: 'Удалить конфигурацию' })
  @ApiParam({ name: 'id', description: 'ID конфигурации' })
  @ApiResponse({ status: 200, description: 'Конфигурация удалена' })
  @ApiResponse({ status: 404, description: 'Конфигурация не найдена' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.switchgearService.remove(id);
  }
}
