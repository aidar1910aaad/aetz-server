import { IsOptional, IsString, IsNotEmpty } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCategoryDto {
  @ApiPropertyOptional({ example: 'Новое название' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'NEW_CODE' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  code?: string;
}
