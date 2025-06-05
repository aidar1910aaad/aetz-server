import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTransformerDto {
  @ApiPropertyOptional({ 
    example: 'ТСЛ-1250/20',
    description: 'Модель трансформатора (например: ТМГ-1000/10, ТСЛ-1250/20)'
  })
  @IsString()
  @IsOptional()
  model?: string;

  @ApiPropertyOptional({ 
    example: '20',
    description: 'Номинальное напряжение (кВ). Примеры: 10, 20, 35, 110'
  })
  @IsString()
  @IsOptional()
  voltage?: string;

  @ApiPropertyOptional({ 
    example: 'ТСЛ',
    description: 'Тип трансформатора. Примеры: ТМГ, ТСЛ, ТМЗ'
  })
  @IsString()
  @IsOptional()
  type?: string;

  @ApiPropertyOptional({ 
    example: 1250,
    description: 'Мощность трансформатора (кВА). Примеры: 25, 40, 63, 100, 160, 250, 400, 630, 1000, 1250, 1600, 2000, 2500, 3150, 4000'
  })
  @IsNumber()
  @IsOptional()
  power?: number;

  @ApiPropertyOptional({ 
    example: 'Alageum',
    description: 'Производитель трансформатора. Примеры: Alageum, ZBB'
  })
  @IsString()
  @IsOptional()
  manufacturer?: string;

  @ApiPropertyOptional({ 
    example: 6996275,
    description: 'Цена трансформатора (тенге)'
  })
  @IsNumber()
  @IsOptional()
  price?: number;
} 