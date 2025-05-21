import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min, IsNotEmpty } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 1, description: 'ID категории' })
  @IsInt()
  @Min(1)
  id: number;

  @ApiProperty({ example: 'Электрооборудование', description: 'Название категории (уникальное)' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'Для расчётов по силовому оборудованию' })
  @IsOptional()
  @IsString()
  description?: string;
}
