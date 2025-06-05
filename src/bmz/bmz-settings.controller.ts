import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { BmzSettingsService } from './bmz-settings.service';
import { UpdateBmzSettingsDto } from './dto/update-bmz-settings.dto';
import { BmzSettings } from './entities/bmz-settings.entity';

@ApiTags('BMZ Settings')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('bmz/settings')
export class BmzSettingsController {
  constructor(private readonly bmzSettingsService: BmzSettingsService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.PTO)
  @ApiOperation({ summary: 'Получить настройки БМЗ' })
  @ApiResponse({
    status: 200,
    description: 'Настройки успешно получены',
    type: BmzSettings
  })
  @ApiResponse({
    status: 401,
    description: 'Не авторизован'
  })
  @ApiResponse({
    status: 403,
    description: 'Нет доступа'
  })
  async getSettings(): Promise<BmzSettings> {
    return this.bmzSettingsService.getSettings();
  }

  @Put()
  @Roles(UserRole.ADMIN, UserRole.PTO)
  @ApiOperation({ summary: 'Обновить настройки БМЗ' })
  @ApiResponse({
    status: 200,
    description: 'Настройки успешно обновлены',
    type: BmzSettings
  })
  @ApiResponse({
    status: 400,
    description: 'Неверные данные'
  })
  @ApiResponse({
    status: 401,
    description: 'Не авторизован'
  })
  @ApiResponse({
    status: 403,
    description: 'Нет доступа'
  })
  async updateSettings(
    @Body() updateSettingsDto: UpdateBmzSettingsDto
  ): Promise<BmzSettings> {
    return this.bmzSettingsService.updateSettings(updateSettingsDto);
  }
} 