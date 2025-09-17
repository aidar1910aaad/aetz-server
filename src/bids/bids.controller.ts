import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { BidsService } from './bids.service';
import { CreateBidDto } from './dto/create-bid.dto';
import { UpdateBidDto } from './dto/update-bid.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { Bid } from './entities/bid.entity';

@ApiTags('Заявки')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('bids')
export class BidsController {
  constructor(private readonly bidsService: BidsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.PTO, UserRole.MANAGER)
  @ApiOperation({ 
    summary: 'Создать новую заявку',
    description: 'Доступно для: Администратор, ПТО, Менеджер. Создает заявку с автоматической генерацией номера.'
  })
  @ApiBody({ 
    type: CreateBidDto,
    description: 'Данные для создания заявки',
    examples: {
      'БКТП заявка': {
        summary: 'Пример заявки БКТП',
        value: {
          type: 'БКТП',
          date: '2025-09-17',
          client: 'ООО Ромашка',
          taskNumber: 'TASK-001',
          totalAmount: 52899246.59,
          user: {
            id: 4,
            username: 'aidarr',
            firstName: 'Айдар',
            lastName: 'Айдарович'
          },
          data: {
            bmz: { 
              buildingType: 'bmz', 
              length: 5000, 
              width: 6000, 
              height: 3000, 
              thickness: 100,
              total: 1500000
            },
            transformer: { 
              selected: { id: 1, model: 'ТСЛ-1250/20', price: 19026000 }, 
              total: 19026000 
            },
            rusn: { 
              cellConfigs: [
                { type: '0.4kv', materials: { switch: { id: 1, name: 'Выключатель', price: 50000 } } }
              ], 
              busbarSummary: { total: 100000 },
              total: 150000 
            },
            runn: { 
              cellSummaries: [
                { type: '10kv', quantity: 2, total: 500000 }
              ], 
              total: 9088368.92 
            },
            additionalEquipment: { 
              selected: { id: 1, name: 'Вентиляция' }, 
              equipmentList: [
                { id: 1, name: 'Вентиляция', price: 50000 },
                { id: 2, name: 'Утепление', price: 30000 }
              ], 
              total: 80000 
            },
            works: { 
              selected: { id: 1, name: 'Монтаж' }, 
              worksList: [
                { id: 1, name: 'Монтаж БМЗ', price: 500000 },
                { id: 2, name: 'Монтаж трансформатора', price: 300000 }
              ], 
              total: 1865410 
            }
          }
        }
      }
    }
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Заявка успешно создана', 
    type: Bid,
    schema: {
      example: {
        id: 1,
        bidNumber: 'BID-2024-001',
        type: 'БКТП',
        date: '2025-09-17',
        client: 'фывафыва',
        taskNumber: 'укфыва',
        totalAmount: 52899246.59,
        data: {
          bmz: { 
            buildingType: 'bmz', 
            length: 5000, 
            width: 6000, 
            height: 3000, 
            thickness: 100,
            total: 1500000
          },
          transformer: { 
            selected: { id: 1, model: 'ТСЛ-1250/20', price: 19026000 }, 
            total: 19026000 
          },
          rusn: { 
            cellConfigs: [
              { type: '0.4kv', materials: { switch: { id: 1, name: 'Выключатель', price: 50000 } } }
            ], 
            busbarSummary: { total: 100000 },
            total: 150000 
          },
          runn: { 
            cellSummaries: [
              { type: '10kv', quantity: 2, total: 500000 }
            ], 
            total: 9088368.92 
          },
          additionalEquipment: { 
            selected: { id: 1, name: 'Вентиляция' }, 
            equipmentList: [
              { id: 1, name: 'Вентиляция', price: 50000 },
              { id: 2, name: 'Утепление', price: 30000 }
            ], 
            total: 80000 
          },
          works: { 
            selected: { id: 1, name: 'Монтаж' }, 
            worksList: [
              { id: 1, name: 'Монтаж БМЗ', price: 500000 },
              { id: 2, name: 'Монтаж трансформатора', price: 300000 }
            ], 
            total: 1865410 
          }
        },
        user: { id: 4, username: 'aidarr', firstName: 'Айдар', lastName: 'Айдарович' },
        createdAt: '2024-09-17T10:00:00Z',
        updatedAt: '2024-09-17T10:00:00Z'
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Неверные данные' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  create(@Body() createBidDto: CreateBidDto) {
    return this.bidsService.create(createBidDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.PTO, UserRole.MANAGER)
  @ApiOperation({ 
    summary: 'Получить все заявки',
    description: 'Доступно для: Администратор, ПТО, Менеджер. Можно фильтровать по пользователю.'
  })
  @ApiQuery({ 
    name: 'userId', 
    required: false, 
    description: 'Фильтр по ID пользователя',
    example: 4
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Список заявок', 
    type: [Bid]
  })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  findAll(@Query('userId') userId?: number) {
    if (userId) {
      return this.bidsService.findByUser(userId);
    }
    return this.bidsService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.PTO, UserRole.MANAGER)
  @ApiOperation({ 
    summary: 'Получить заявку по ID',
    description: 'Доступно для: Администратор, ПТО, Менеджер'
  })
  @ApiParam({ 
    name: 'id', 
    type: 'number', 
    description: 'ID заявки',
    example: 1
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Заявка найдена', 
    type: Bid
  })
  @ApiResponse({ status: 404, description: 'Заявка не найдена' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bidsService.findOne(id);
  }

  @Get('number/:bidNumber')
  @Roles(UserRole.ADMIN, UserRole.PTO, UserRole.MANAGER)
  @ApiOperation({ 
    summary: 'Получить заявку по номеру',
    description: 'Доступно для: Администратор, ПТО, Менеджер'
  })
  @ApiParam({ 
    name: 'bidNumber', 
    type: 'string', 
    description: 'Номер заявки',
    example: 'BID-2024-001'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Заявка найдена', 
    type: Bid
  })
  @ApiResponse({ status: 404, description: 'Заявка не найдена' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  findByBidNumber(@Param('bidNumber') bidNumber: string) {
    return this.bidsService.findByBidNumber(bidNumber);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.PTO, UserRole.MANAGER)
  @ApiOperation({ 
    summary: 'Обновить заявку',
    description: 'Доступно для: Администратор, ПТО, Менеджер. Можно обновить любые поля частично.'
  })
  @ApiParam({ 
    name: 'id', 
    type: 'number', 
    description: 'ID заявки',
    example: 1
  })
  @ApiBody({ 
    type: UpdateBidDto,
    description: 'Данные для обновления заявки (все поля опциональны)',
    examples: {
      'Обновление клиента': {
        summary: 'Обновить только клиента',
        value: {
          client: 'Новое название клиента'
        }
      },
      'Обновление данных': {
        summary: 'Обновить данные заявки',
        value: {
          data: {
            bmz: { 
              buildingType: 'bmz', 
              length: 6000, 
              width: 7000, 
              height: 3500, 
              thickness: 120,
              total: 2000000
            }
          }
        }
      }
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Заявка успешно обновлена', 
    type: Bid
  })
  @ApiResponse({ status: 404, description: 'Заявка не найдена' })
  @ApiResponse({ status: 400, description: 'Неверные данные' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateBidDto: UpdateBidDto) {
    return this.bidsService.update(id, updateBidDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.PTO, UserRole.MANAGER)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ 
    summary: 'Удалить заявку',
    description: 'Доступно для: Администратор, ПТО, Менеджер'
  })
  @ApiParam({ 
    name: 'id', 
    type: 'number', 
    description: 'ID заявки',
    example: 1
  })
  @ApiResponse({ status: 204, description: 'Заявка успешно удалена' })
  @ApiResponse({ status: 404, description: 'Заявка не найдена' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.bidsService.remove(id);
  }
}
