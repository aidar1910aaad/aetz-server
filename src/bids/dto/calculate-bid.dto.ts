import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsObject, IsOptional, IsString } from 'class-validator';

export class CalculateBidDto {
  @ApiPropertyOptional({ example: 'БКТП' })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiProperty({
    description: 'Черновые данные заявки для онлайн пересчета',
    type: 'object',
    additionalProperties: true,
  })
  @IsObject()
  data: any;
}

export class CalculateBidResponseDto {
  @ApiProperty({ example: 52899246.59 })
  totalAmount: number;

  @ApiProperty({
    description: 'Пересчитанные данные (snapshot/totals/pricingMeta)',
    type: 'object',
    additionalProperties: true,
  })
  data: any;
}
