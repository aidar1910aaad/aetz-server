import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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

  @ApiProperty({
    example: 1,
    description: 'ID категории (опционально)',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  categoryId?: number;
}
