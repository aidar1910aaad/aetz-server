import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../users/entities/user.entity';
import { WorkPricesSettingsService } from './work-prices-settings.service';

@ApiTags('work-prices-settings')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('work-prices-settings')
export class WorkPricesSettingsController {
  constructor(private readonly service: WorkPricesSettingsService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.PTO, UserRole.MANAGER)
  @ApiOperation({ summary: 'Получить настройки цен работ' })
  @ApiResponse({ status: 200, description: 'Настройки цен работ' })
  async getSettings(): Promise<Record<string, number>> {
    return this.service.getSettings();
  }

  @Put()
  @Roles(UserRole.ADMIN, UserRole.PTO)
  @ApiOperation({ summary: 'Обновить настройки цен работ' })
  @ApiResponse({ status: 200, description: 'Обновленные настройки цен работ' })
  async updateSettings(@Body() patch: Record<string, unknown>): Promise<Record<string, number>> {
    return this.service.updateSettings(patch);
  }
}
