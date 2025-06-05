import { Controller, Get, Put, Body, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { CurrencySettingsService } from './currency-settings.service';
import { CurrencySettings } from './entities/currency-settings.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UpdateCurrencySettingsDto } from './dto/update-currency-settings.dto';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('currency-settings')
@ApiBearerAuth('access-token')
@Controller('currency-settings')
export class CurrencySettingsController {
    constructor(private readonly currencySettingsService: CurrencySettingsService) { }

    @Public()
    @Get()
    @ApiOperation({ summary: 'Получить текущие курсы валют и настройки' })
    @ApiResponse({
        status: 200,
        description: 'Возвращает текущие настройки',
        type: CurrencySettings
    })
    @ApiResponse({
        status: 500,
        description: 'Внутренняя ошибка сервера'
    })
    async getSettings() {
        try {
            return await this.currencySettingsService.getSettings();
        } catch (error) {
            throw new HttpException(
                error.message || 'Ошибка при получении настроек валют',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put()
    @Roles(UserRole.ADMIN, UserRole.PTO)
    @ApiOperation({ summary: 'Обновить курсы валют и настройки' })
    @ApiResponse({
        status: 200,
        description: 'Настройки успешно обновлены',
        type: CurrencySettings
    })
    @ApiResponse({
        status: 403,
        description: 'Доступ запрещен. Требуются права администратора или PTO'
    })
    async updateSettings(@Body() updateData: UpdateCurrencySettingsDto) {
        try {
            return await this.currencySettingsService.updateSettings(updateData);
        } catch (error) {
            throw new HttpException(
                error.message || 'Ошибка при обновлении настроек валют',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
} 