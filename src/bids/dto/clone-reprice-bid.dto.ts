import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

export class CloneRepriceBidDto {
  @ApiPropertyOptional({
    description: 'Перезаписать дату новой заявки на текущую',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  useCurrentDate?: boolean;

  @ApiPropertyOptional({
    description: 'Кастомная дата новой заявки (YYYY-MM-DD)',
    example: '2026-05-05',
  })
  @IsOptional()
  @IsString()
  date?: string;

  @ApiPropertyOptional({
    description: 'Переопределение клиента для новой заявки',
    example: 'ТОО Example',
  })
  @IsOptional()
  @IsString()
  client?: string;

  @ApiPropertyOptional({
    description: 'Переопределение номера задачи',
    example: 'TASK-002',
  })
  @IsOptional()
  @IsString()
  taskNumber?: string;

  @ApiPropertyOptional({
    description: 'Переопределение наценки менеджера в процентах',
    example: 15,
  })
  @IsOptional()
  @IsNumber()
  managerMarkupPercent?: number;

  @ApiPropertyOptional({
    description: 'Переопределение заметок к заявке',
    example: 'Пересчитано по новому прайсу',
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({
    description: 'Дополнительные переопределения для data.config',
    type: 'object',
    additionalProperties: true,
  })
  @IsOptional()
  @IsObject()
  configOverrides?: Record<string, any>;
}

export class CloneRepriceBidResponseDto {
  @ApiProperty({ example: 12 })
  id: number;

  @ApiProperty({ example: 'AETZ – 2026 – 15' })
  bidNumber: string;

  @ApiProperty({
    description: 'Итоги по дельте пересчета',
    type: 'object',
    additionalProperties: true,
  })
  repriceDiff: Record<string, any>;
}
