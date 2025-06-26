import { IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCalculationGroupDto {
  @ApiPropertyOptional({ 
    example: 'Камера КСО А12-10 (обновленное название)',
    description: 'Новое название группы (slug будет сгенерирован автоматически)'
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: 20,
    description: 'Новый тип вольтажа (например: 10, 20, 35 и т.д.)',
  })
  @IsOptional()
  @IsNumber()
  voltageType?: number;
} 