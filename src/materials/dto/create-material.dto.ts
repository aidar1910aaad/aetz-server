import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMaterialDto {
  private static readonly ALLOWED_CURRENCIES = ['KZT', 'RUB', 'USD', 'EUR', 'CNY'] as const;

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
    description: 'Устаревшее поле для совместимости (цена в KZT)',
  })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiPropertyOptional({
    example: 'RUB',
    description: 'Валюта цены материала',
    enum: CreateMaterialDto.ALLOWED_CURRENCIES,
  })
  @IsOptional()
  @IsString()
  @IsIn(CreateMaterialDto.ALLOWED_CURRENCIES)
  currency?: string;

  @ApiPropertyOptional({
    example: 35000,
    description: 'Стоимость материала в выбранной валюте',
  })
  @IsOptional()
  @IsNumber()
  priceInCurrency?: number;

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
