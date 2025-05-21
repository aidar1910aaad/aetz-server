import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMaterialDto {
  @ApiProperty({
    example: 'Вакуумный выключатель AV-24 1250A',
    description: 'Наименование материала',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'шт',
    description: 'Единица измерения (например, "шт", "м", "кг")',
  })
  @IsString()
  unit: string;

  @ApiProperty({
    example: 1610000,
    description: 'Цена без НДС',
  })
  @IsNumber()
  price: number;

  @ApiProperty({ example: '10000009398' })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'ID категории (если не указан, категория будет null)',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  categoryId?: number;
}
