import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min, IsNotEmpty } from 'class-validator';

export class CreateCategoryDto {
  @ApiPropertyOptional({
    example: 1001,
    description:
      'Уникальный идентификатор категории (4 цифры). Если не указан — сгенерируется автоматически',
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  id?: number;

  @ApiProperty({
    example: 'Электрооборудование',
    description: 'Название категории (должно быть уникальным)',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    example: 'Категория для электрооборудования и комплектующих',
    description: 'Подробное описание категории',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: 'ELEC',
    description: 'Уникальный код категории (генерируется автоматически, если не указан)',
    maxLength: 10,
  })
  @IsOptional()
  @IsString()
  code?: string;
}
