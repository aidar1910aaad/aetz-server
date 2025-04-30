import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Электрооборудование', description: 'Название категории (уникальное)' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'Для расчётов по силовому оборудованию' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 123 })
  @IsOptional()
  @IsInt()
  @Min(1)
  id?: number;
}
