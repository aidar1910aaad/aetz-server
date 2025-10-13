import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@ApiTags('Пользователи')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'pto')
  @Post()
  @ApiOperation({ 
    summary: 'Создать нового пользователя',
    description: 'Создает нового пользователя в системе. Доступно только для администраторов и ПТО.'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Пользователь успешно создан',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        username: { type: 'string', example: 'newuser' },
        role: { type: 'string', enum: ['ADMIN', 'PTO', 'USER'], example: 'USER' },
        createdAt: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'pto')
  @Get()
  @ApiOperation({ 
    summary: 'Получить список всех пользователей',
    description: 'Возвращает список всех пользователей системы с их ролями и статусами.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Список пользователей получен',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          username: { type: 'string', example: 'admin' },
          role: { type: 'string', enum: ['ADMIN', 'PTO', 'USER'], example: 'ADMIN' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  findAll() {
    return this.usersService.findAll();
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get('profile/me')
  @ApiOperation({ 
    summary: 'Получить свой профиль',
    description: 'Возвращает информацию о текущем авторизованном пользователе.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Профиль получен',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        username: { type: 'string', example: 'john_doe' },
        firstName: { type: 'string', example: 'John' },
        lastName: { type: 'string', example: 'Doe' },
        email: { type: 'string', example: 'john@example.com' },
        phone: { type: 'string', example: '+77001234567' },
        position: { type: 'string', example: 'ПТО инженер' },
        country: { type: 'string', example: 'Казахстан' },
        city: { type: 'string', example: 'Астана' },
        postalCode: { type: 'string', example: '010000' },
        role: { type: 'string', enum: ['admin', 'pto', 'manager'], example: 'pto' },
        createdAt: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  getProfile(@CurrentUser() user: JwtPayload) {
    return this.usersService.findById(user.id);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'pto')
  @Get(':id')
  @ApiOperation({ 
    summary: 'Получить пользователя по ID',
    description: 'Возвращает детальную информацию о конкретном пользователе по его ID.'
  })
  @ApiParam({ name: 'id', type: Number, description: 'ID пользователя' })
  @ApiResponse({ 
    status: 200, 
    description: 'Пользователь найден',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        username: { type: 'string', example: 'admin' },
        role: { type: 'string', enum: ['ADMIN', 'PTO', 'USER'], example: 'ADMIN' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  findOne(@Param('id') id: string) {
    return this.usersService.findById(+id);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Patch('profile/me')
  @ApiOperation({ 
    summary: 'Обновить свой профиль',
    description: 'Позволяет пользователю редактировать свои профильные данные. Нельзя изменить роль или username.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Профиль успешно обновлен',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        username: { type: 'string', example: 'john_doe' },
        firstName: { type: 'string', example: 'John' },
        lastName: { type: 'string', example: 'Doe' },
        email: { type: 'string', example: 'john@example.com' },
        phone: { type: 'string', example: '+77001234567' },
        position: { type: 'string', example: 'ПТО инженер' },
        country: { type: 'string', example: 'Казахстан' },
        city: { type: 'string', example: 'Астана' },
        postalCode: { type: 'string', example: '010000' },
        role: { type: 'string', enum: ['admin', 'pto', 'manager'], example: 'pto' },
        createdAt: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  updateProfile(@CurrentUser() user: JwtPayload, @Body() updateDto: UpdateProfileDto) {
    return this.usersService.updateProfile(user.id, updateDto);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id')
  @ApiOperation({ 
    summary: 'Обновить пользователя',
    description: 'Обновляет информацию о пользователе. Доступно только для администраторов.'
  })
  @ApiParam({ name: 'id', type: Number, description: 'ID пользователя' })
  @ApiResponse({ 
    status: 200, 
    description: 'Пользователь успешно обновлен',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        username: { type: 'string', example: 'updateduser' },
        role: { type: 'string', enum: ['ADMIN', 'PTO', 'USER'], example: 'USER' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  update(@Param('id') id: string, @Body() updateDto: UpdateUserDto) {
    return this.usersService.update(+id, updateDto);
  }
  

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  @ApiOperation({ 
    summary: 'Удалить пользователя',
    description: 'Безвозвратно удаляет пользователя из системы. Доступно только для администраторов.'
  })
  @ApiParam({ name: 'id', type: Number, description: 'ID пользователя' })
  @ApiResponse({ 
    status: 200, 
    description: 'Пользователь успешно удален',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Пользователь успешно удален' }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
