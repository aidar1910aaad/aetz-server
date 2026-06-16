import { IsOptional, IsString, IsNotEmpty, MaxLength, IsInt, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCategoryDto {
  @ApiPropertyOptional({
    example: 1001,
    description: 'Новый ID категории',
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  id?: number;

  @ApiPropertyOptional({
    example: 'Новое название категории',
    description: 'Новое название категории (должно быть уникальным)',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({
    example: 'NEW_CODE',
    description: 'Новый уникальный код категории',
    maxLength: 10,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  code?: string;

  @ApiPropertyOptional({
    example: 'Обновленное описание категории',
    description: 'Новое описание категории',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}
