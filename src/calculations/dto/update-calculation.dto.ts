import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateCalculationItemDto } from './create-calculation-item.dto';

export class UpdateCalculationDto {
  @ApiPropertyOptional({ example: 'Обновлённая калькуляция' })
  name?: string;

  @ApiPropertyOptional({ type: [CreateCalculationItemDto] })
  items?: CreateCalculationItemDto[];

  @ApiPropertyOptional({ example: 'Aidar' })
  changedBy?: string;
}
