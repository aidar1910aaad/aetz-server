// src/calculations/dto/create-calculation-group.dto.ts
import { IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCalculationGroupDto {
  @ApiProperty({ 
    example: 'Камера КСО А12-10',
    description: 'Название группы (slug будет сгенерирован автоматически)'
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 10,
    description: 'Тип вольтажа (например: 10, 20, 35 и т.д.)',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  voltageType?: number;
}
