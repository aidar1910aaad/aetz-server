import { IsString, IsNumber, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTransformerDto {
  @ApiProperty({ example: 'ТСЛ-1250/20', description: 'Модель трансформатора' })
  @IsString()
  @IsNotEmpty()
  model: string;

  @ApiProperty({ example: '20', description: 'Номинальное напряжение' })
  @IsString()
  @IsNotEmpty()
  voltage: string;

  @ApiProperty({ example: 'ТСЛ', description: 'Тип трансформатора' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ example: 1250, description: 'Мощность трансформатора' })
  @IsNumber()
  @IsNotEmpty()
  power: number;

  @ApiProperty({ example: 'Alageum', description: 'Производитель' })
  @IsString()
  @IsNotEmpty()
  manufacturer: string;

  @ApiProperty({ example: 6996275, description: 'Цена трансформатора' })
  @IsNumber()
  @IsNotEmpty()
  price: number;
} 