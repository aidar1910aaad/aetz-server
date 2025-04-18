import { ApiProperty } from '@nestjs/swagger';
import { CalculationStatus } from '../calculation-status.enum';

export class UpdateStatusDto {
  @ApiProperty({ enum: CalculationStatus, example: CalculationStatus.IN_PROGRESS })
  status: CalculationStatus;

  @ApiProperty({ example: 'Aidar' })
  changedBy: string;
}
