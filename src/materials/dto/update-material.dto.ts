import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateMaterialDto {
  private static readonly ALLOWED_CURRENCIES = ['KZT', 'RUB', 'USD', 'EUR'] as const;

  @ApiPropertyOptional({ example: 'Новый материал' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'шт' })
  @IsOptional()
  @IsString()
  unit?: string;

  @ApiPropertyOptional({ example: 100000 })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiPropertyOptional({
    example: 'RUB',
    description: 'Валюта цены материала',
    enum: UpdateMaterialDto.ALLOWED_CURRENCIES,
  })
  @IsOptional()
  @IsString()
  @IsIn(UpdateMaterialDto.ALLOWED_CURRENCIES)
  currency?: string;

  @ApiPropertyOptional({
    example: 35000,
    description: 'Стоимость материала в выбранной валюте',
  })
  @IsOptional()
  @IsNumber()
  priceInCurrency?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber()
  categoryId?: number;

  @ApiPropertyOptional({ example: 'admin' })
  @IsOptional()
  @IsString()
  changedBy?: string;
}
