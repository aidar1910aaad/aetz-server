import { Controller, Get, Post, Put, Body, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { Setting } from './entities/setting.entity';
import { CreateSettingDto } from './dto/create-setting.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('settings')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('settings')
export class SettingsController {
    constructor(private readonly settingsService: SettingsService) { }

    @Get()
    @ApiOperation({
        summary: 'Получить текущие настройки',
        description: 'Возвращает единственную запись настроек из базы данных'
    })
    @ApiResponse({
        status: 200,
        description: 'Возвращает текущие настройки',
        type: Setting
    })
    @ApiResponse({
        status: 401,
        description: 'Требуется авторизация'
    })
    @ApiResponse({
        status: 404,
        description: 'Настройки не найдены'
    })
    async getSettings() {
        return this.settingsService.getSettings();
    }

    @Post()
    @Roles(UserRole.ADMIN)
    @ApiOperation({
        summary: 'Создать начальные настройки',
        description: 'Создает первую запись настроек. Этот метод можно использовать только один раз при первой инициализации.'
    })
    @ApiResponse({
        status: 201,
        description: 'Настройки успешно созданы',
        type: Setting
    })
    @ApiResponse({
        status: 401,
        description: 'Требуется авторизация'
    })
    @ApiResponse({
        status: 403,
        description: 'Доступ запрещен. Требуются права администратора'
    })
    async create(@Body() createSettingDto: CreateSettingDto) {
        return this.settingsService.create(createSettingDto);
    }

    @Put()
    @Roles(UserRole.ADMIN, UserRole.PTO)
    @ApiOperation({
        summary: 'Обновить текущие настройки',
        description: 'Обновляет существующие настройки. Можно отправить только те секции, которые нужно обновить. Остальные останутся без изменений.'
    })
    @ApiResponse({
        status: 200,
        description: 'Настройки успешно обновлены',
        type: Setting
    })
    @ApiResponse({
        status: 401,
        description: 'Требуется авторизация'
    })
    @ApiResponse({
        status: 403,
        description: 'Доступ запрещен. Требуются права администратора или PTO'
    })
    @ApiResponse({
        status: 404,
        description: 'Настройки не найдены'
    })
    async update(@Body() updateSettingDto: CreateSettingDto) {
        return this.settingsService.update(updateSettingDto);
    }
} 