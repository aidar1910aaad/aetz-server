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
import { TransformersService } from './transformers.service';
import { CreateTransformerDto } from './dto/create-transformer.dto';
import { UpdateTransformerDto } from './dto/update-transformer.dto';
import { CreateTransformersDto } from './dto/create-transformers.dto';
import { Transformer } from './entities/transformer.entity';
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

@ApiTags('Трансформаторы')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('transformers')
export class TransformersController {
  constructor(private readonly transformersService: TransformersService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.PTO)
  @ApiOperation({ summary: 'Создать новый трансформатор' })
  @ApiResponse({ status: 201, type: Transformer })
  create(@Body() createTransformerDto: CreateTransformerDto) {
    return this.transformersService.create(createTransformerDto);
  }

  @Post('batch')
  @ApiOperation({ summary: 'Создать несколько трансформаторов' })
  @ApiResponse({ status: 201, description: 'Трансформаторы успешно созданы.' })
  createMany(@Body() createTransformersDto: CreateTransformersDto) {
    return this.transformersService.createMany(createTransformersDto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить список всех трансформаторов' })
  @ApiResponse({ status: 200, type: [Transformer] })
  findAll() {
    return this.transformersService.findAll();
  }

  @Get('voltage/:voltage')
  @ApiOperation({ summary: 'Получить трансформаторы по напряжению' })
  @ApiParam({ name: 'voltage', type: String, description: 'Номинальное напряжение' })
  @ApiResponse({ status: 200, type: [Transformer] })
  findByVoltage(@Param('voltage') voltage: string) {
    return this.transformersService.findByVoltage(voltage);
  }

  @Get('type/:type')
  @ApiOperation({ summary: 'Получить трансформаторы по типу' })
  @ApiParam({ name: 'type', type: String, description: 'Тип трансформатора' })
  @ApiResponse({ status: 200, type: [Transformer] })
  findByType(@Param('type') type: string) {
    return this.transformersService.findByType(type);
  }

  @Get('manufacturer/:manufacturer')
  @ApiOperation({ summary: 'Получить трансформаторы по производителю' })
  @ApiParam({ name: 'manufacturer', type: String })
  @ApiResponse({ status: 200, type: [Transformer] })
  findByManufacturer(@Param('manufacturer') manufacturer: string) {
    return this.transformersService.findByManufacturer(manufacturer);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить трансформатор по ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, type: Transformer })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.transformersService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.PTO)
  @ApiOperation({ summary: 'Обновить трансформатор' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, type: Transformer })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTransformerDto: UpdateTransformerDto,
  ) {
    return this.transformersService.update(id, updateTransformerDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.PTO)
  @ApiOperation({ summary: 'Удалить трансформатор' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200 })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.transformersService.remove(id);
  }
} 