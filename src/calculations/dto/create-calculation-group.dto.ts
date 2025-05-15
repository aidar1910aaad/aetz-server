// src/calculations/dto/create-calculation-group.dto.ts
import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCalculationGroupDto {
  @ApiProperty({ example: 'Камера КСО А12-10' })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'kso-a12-10',
    description: 'Slug (необязательно, будет сгенерирован из name)',
    required: false,
  })
  @IsOptional()
  @IsString()
  slug?: string;
}
