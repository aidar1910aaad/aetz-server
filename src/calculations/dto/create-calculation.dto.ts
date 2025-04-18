import { ApiProperty } from '@nestjs/swagger';
import { CreateCalculationItemDto } from './create-calculation-item.dto';

export class CreateCalculationDto {
  @ApiProperty({ example: 'Калькуляция на подстанцию №3' })
  name: string;

  @ApiProperty({ example: 'Aidar' })
  createdBy: string;

  @ApiProperty({ type: [CreateCalculationItemDto] })
  items: CreateCalculationItemDto[];
}
