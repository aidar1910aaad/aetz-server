import { IsString, IsNumber, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTransformerDto {
  @ApiProperty({ 
    example: 'ТСЛ-1250/20',
    description: 'Модель трансформатора (например: ТМГ-1000/10, ТСЛ-1250/20)'
  })
  @IsString()
  @IsNotEmpty()
  model: string;

  @ApiProperty({ 
    example: '20',
    description: 'Номинальное напряжение (кВ). Примеры: 10, 20, 35, 110'
  })
  @IsString()
  @IsNotEmpty()
  voltage: string;

  @ApiProperty({ 
    example: 'ТСЛ',
    description: 'Тип трансформатора. Примеры: ТМГ, ТСЛ, ТМЗ'
  })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ 
    example: 1250,
    description: 'Мощность трансформатора (кВА). Примеры: 25, 40, 63, 100, 160, 250, 400, 630, 1000, 1250, 1600, 2000, 2500, 3150, 4000'
  })
  @IsNumber()
  @IsNotEmpty()
  power: number;

  @ApiProperty({ 
    example: 'Alageum',
    description: 'Производитель трансформатора. Примеры: Alageum, ZBB'
  })
  @IsString()
  @IsNotEmpty()
  manufacturer: string;

  @ApiProperty({ 
    example: 6996275,
    description: 'Цена трансформатора (тенге)'
  })
  @IsNumber()
  @IsNotEmpty()
  price: number;
} 