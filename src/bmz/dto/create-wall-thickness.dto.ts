import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min, IsPositive } from 'class-validator';

export class CreateWallThicknessDto {
  @ApiProperty({ 
    example: 0,
    description: 'Минимальная толщина стены (мм)'
  })
  @IsNumber()
  @Min(0)
  minThickness: number;

  @ApiProperty({ 
    example: 80,
    description: 'Максимальная толщина стены (мм)'
  })
  @IsNumber()
  @Min(0)
  maxThickness: number;

  @ApiProperty({ 
    example: 2000,
    description: 'Дополнительная цена за квадратный метр'
  })
  @IsNumber()
  @IsPositive()
  pricePerSquareMeter: number;
} 