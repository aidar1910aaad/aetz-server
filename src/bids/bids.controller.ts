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
} from '@nestjs/common';
import { BidsService } from './bids.service';
import { CreateBidDto } from './dto/create-bid.dto';
import { UpdateBidDto } from './dto/update-bid.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
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
  @ApiOperation({ summary: 'Создать новую заявку' })
  @ApiResponse({ status: 201, description: 'Заявка успешно создана.', type: Bid })
  @ApiResponse({ status: 400, description: 'Неверный запрос.' })
  @ApiResponse({ status: 403, description: 'Доступ запрещен.' })
  create(@Body() createBidDto: CreateBidDto) {
    return this.bidsService.create(createBidDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.PTO, UserRole.MANAGER)
  @ApiOperation({ summary: 'Получить все заявки' })
  @ApiResponse({ status: 200, description: 'Список всех заявок.', type: [Bid] })
  findAll() {
    return this.bidsService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.PTO, UserRole.MANAGER)
  @ApiOperation({ summary: 'Получить заявку по ID' })
  @ApiResponse({ status: 200, description: 'Возвращает одну заявку.', type: Bid })
  @ApiResponse({ status: 404, description: 'Заявка не найдена.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bidsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.PTO, UserRole.MANAGER)
  @ApiOperation({ summary: 'Обновить заявку' })
  @ApiResponse({ status: 200, description: 'Заявка успешно обновлена.', type: Bid })
  @ApiResponse({ status: 404, description: 'Заявка не найдена.' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateBidDto: UpdateBidDto) {
    return this.bidsService.update(id, updateBidDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.PTO, UserRole.MANAGER)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удалить заявку' })
  @ApiResponse({ status: 204, description: 'Заявка успешно удалена.' })
  @ApiResponse({ status: 404, description: 'Заявка не найдена.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.bidsService.remove(id);
  }
}
