import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCalculationItemDto {
  @ApiProperty({ example: 'custom', enum: ['custom', 'material'] })
  type: 'material' | 'custom';

  @ApiProperty({ example: 'Монтаж выключателя' })
  title: string;

  @ApiProperty({ example: 'шт' })
  unit: string;

  @ApiProperty({ example: 2 })
  quantity: number;

  @ApiProperty({ example: 12000 })
  unitPrice: number;

  @ApiPropertyOptional({ example: 5 })
  materialId?: number;
}
