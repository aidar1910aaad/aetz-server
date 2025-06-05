import { ApiProperty } from '@nestjs/swagger';

export class CreateAreaPriceDto {
  @ApiProperty({
    description: 'Минимальная площадь (м²)',
    example: 0
  })
  minArea: number;

  @ApiProperty({
    description: 'Максимальная площадь (м²)',
    example: 100
  })
  maxArea: number;

  @ApiProperty({
    description: 'Минимальная толщина стен (мм)',
    example: 0
  })
  minWallThickness: number;

  @ApiProperty({
    description: 'Максимальная толщина стен (мм)',
    example: 80
  })
  maxWallThickness: number;

  @ApiProperty({
    description: 'Базовая цена за квадратный метр',
    example: 2000
  })
  basePricePerSquareMeter: number;
} 