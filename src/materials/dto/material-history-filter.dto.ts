import { IsOptional, IsString, IsNumber, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class MaterialHistoryFilterDto {
  @ApiPropertyOptional({
    example: 'Вакуумный выключатель',
    description: 'Фильтр по названию материала',
  })
  @IsOptional()
  @IsString()
  materialName?: string;

  @ApiPropertyOptional({
    example: '10000009398',
    description: 'Фильтр по коду материала',
  })
  @IsOptional()
  @IsString()
  materialCode?: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'Фильтр по ID категории материала',
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  categoryId?: number;

  @ApiPropertyOptional({
    example: 'name',
    description: 'Фильтр по измененному полю',
  })
  @IsOptional()
  @IsString()
  fieldChanged?: string;

  @ApiPropertyOptional({
    example: 'admin',
    description: 'Фильтр по пользователю, который внес изменения',
  })
  @IsOptional()
  @IsString()
  changedBy?: string;

  @ApiPropertyOptional({
    example: '2024-01-01',
    description: 'Фильтр по дате изменения (от)',
  })
  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @ApiPropertyOptional({
    example: '2024-12-31',
    description: 'Фильтр по дате изменения (до)',
  })
  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @ApiPropertyOptional({
    example: 10,
    description: 'Количество записей на странице',
    default: 10,
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  limit?: number = 10;

  @ApiPropertyOptional({
    example: 0,
    description: 'Смещение для пагинации',
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  offset?: number = 0;
}
