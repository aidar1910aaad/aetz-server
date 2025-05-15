import { IsString, IsNotEmpty, IsObject, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCalculationDto {
  @ApiProperty({ example: 'Камера КСО А12-10 900×1000' })
  @IsString()
  name: string;

  @ApiProperty({ example: '900x1000' })
  @IsString()
  slug: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  groupId: number;

  @ApiProperty({ example: { materials: [], total: 0 } })
  @IsObject()
  data: any;
}