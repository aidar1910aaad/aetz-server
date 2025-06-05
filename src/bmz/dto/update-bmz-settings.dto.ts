import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsArray, IsString, IsEnum, IsOptional, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class AreaPriceRangeDto {
  @ApiProperty({ example: 0, description: 'Минимальная площадь (м²)' })
  @IsNumber()
  @Min(0)
  minArea: number;

  @ApiProperty({ example: 50, description: 'Максимальная площадь (м²)' })
  @IsNumber()
  @Min(0)
  maxArea: number;

  @ApiProperty({ example: 0, description: 'Минимальная толщина стен (мм)' })
  @IsNumber()
  @Min(0)
  minWallThickness: number;

  @ApiProperty({ example: 50, description: 'Максимальная толщина стен (мм)' })
  @IsNumber()
  @Min(0)
  maxWallThickness: number;

  @ApiProperty({ example: 25000, description: 'Цена за квадратный метр' })
  @IsNumber()
  @Min(0)
  pricePerSquareMeter: number;
}

class EquipmentDto {
  @ApiProperty({ example: 'Утепление стен', description: 'Название оборудования' })
  @IsString()
  name: string;

  @ApiProperty({ 
    example: 'perSquareMeter',
    description: 'Тип цены: perSquareMeter, perHalfSquareMeter или fixed',
    enum: ['perSquareMeter', 'perHalfSquareMeter', 'fixed']
  })
  @IsEnum(['perSquareMeter', 'perHalfSquareMeter', 'fixed'])
  priceType: 'perSquareMeter' | 'perHalfSquareMeter' | 'fixed';

  @ApiProperty({ 
    example: 1000, 
    description: 'Цена за квадратный метр (для типов perSquareMeter и perHalfSquareMeter)',
    required: false
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  pricePerSquareMeter?: number;

  @ApiProperty({ 
    example: 5000, 
    description: 'Фиксированная цена (для типа fixed)',
    required: false
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  fixedPrice?: number;

  @ApiProperty({ example: 'Дополнительное утепление стен', description: 'Описание оборудования' })
  @IsString()
  description: string;
}

export class UpdateBmzSettingsDto {
  @ApiProperty({ 
    example: 25000,
    description: 'Базовая цена за квадратный метр'
  })
  @IsNumber()
  @Min(0)
  basePricePerSquareMeter: number;

  @ApiProperty({
    description: 'Диапазоны цен по площади и толщине стен',
    type: [AreaPriceRangeDto]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AreaPriceRangeDto)
  areaPriceRanges: AreaPriceRangeDto[];

  @ApiProperty({
    description: 'Дополнительное оборудование',
    type: [EquipmentDto]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EquipmentDto)
  equipment: EquipmentDto[];

  @ApiProperty({ 
    example: true,
    description: 'Активны ли настройки'
  })
  @IsOptional()
  isActive?: boolean;
} 