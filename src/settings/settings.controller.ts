import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { CreateSettingDto } from './dto/create-setting.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('Settings')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('settings')
export class SettingsController {
    constructor(private readonly settingsService: SettingsService) { }

    @Post()
    @ApiOperation({ summary: 'Создать настройки' })
    @ApiBody({ type: CreateSettingDto })
    @ApiResponse({
        status: 201,
        description: 'Настройки успешно созданы',
        type: CreateSettingDto
    })
    @ApiResponse({
        status: 401,
        description: 'Не авторизован'
    })
    @ApiResponse({
        status: 400,
        description: 'Неверный формат данных'
    })
    create(@Body() dto: CreateSettingDto) {
        return this.settingsService.create(dto);
    }

    @Get()
    @ApiOperation({ summary: 'Получить все настройки' })
    @ApiResponse({
        status: 200,
        description: 'Список настроек',
        type: [CreateSettingDto]
    })
    @ApiResponse({
        status: 401,
        description: 'Не авторизован'
    })
    findAll() {
        return this.settingsService.findAll();
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Обновить настройки' })
    @ApiParam({
        name: 'id',
        description: 'ID настройки',
        type: 'number'
    })
    @ApiBody({ type: CreateSettingDto })
    @ApiResponse({
        status: 200,
        description: 'Настройки обновлены',
        type: CreateSettingDto
    })
    @ApiResponse({
        status: 401,
        description: 'Не авторизован'
    })
    @ApiResponse({
        status: 404,
        description: 'Настройки не найдены'
    })
    @ApiResponse({
        status: 400,
        description: 'Неверный формат данных'
    })
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateSettingDto) {
        return this.settingsService.update(id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Удалить настройки' })
    @ApiParam({
        name: 'id',
        description: 'ID настройки',
        type: 'number'
    })
    @ApiResponse({
        status: 200,
        description: 'Настройки удалены'
    })
    @ApiResponse({
        status: 401,
        description: 'Не авторизован'
    })
    @ApiResponse({
        status: 404,
        description: 'Настройки не найдены'
    })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.settingsService.delete(id);
    }
} 