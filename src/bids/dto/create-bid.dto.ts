import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsObject, IsOptional, IsNotEmpty, IsString, IsNumber } from 'class-validator';

class UserDto {
  @ApiProperty({ example: 4, description: 'ID пользователя' })
  @IsNumber()
  id: number;

  @ApiProperty({ example: 'aidarr', description: 'Имя пользователя' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'Айдар', description: 'Имя' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Айдарович', description: 'Фамилия' })
  @IsString()
  lastName: string;
}

export class CreateBidDto {
  @ApiProperty({
    example: 'БКТП',
    description: 'Тип заявки',
  })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({
    example: '2025-09-17',
    description: 'Дата заявки',
  })
  @IsString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({
    example: 'фывафыва',
    description: 'Название клиента',
  })
  @IsString()
  @IsNotEmpty()
  client: string;

  @ApiProperty({
    example: 'укфыва',
    description: 'Номер задачи',
  })
  @IsString()
  @IsNotEmpty()
  taskNumber: string;

  @ApiPropertyOptional({
    example: 52899246.5920094,
    description: 'Общая сумма заявки',
  })
  @IsOptional()
  @IsNumber()
  totalAmount?: number;

  @ApiProperty({
    description: 'Информация о пользователе',
    type: UserDto,
  })
  @IsObject()
  @IsNotEmpty()
  @Type(() => UserDto)
  user: UserDto;

  @ApiProperty({
    description:
      'Данные заявки. Рекомендуемый v2 формат: data.config + data.snapshot + data.pricingMeta + data.repriceDiff',
    example: {
      config: {
        bmz: { buildingType: 'bmz', length: 5000, width: 6000, height: 3000, thickness: 100 },
        transformer: { selected: { id: 1, model: 'ТСЛ-1250/20', price: 19026000 } },
      },
      snapshot: {
        bmz: { total: 1500000 },
        transformer: { total: 19026000 },
        totals: { grandTotal: 20526000 },
      },
      pricingMeta: { recalculatedAt: '2026-05-05T12:00:00.000Z' },
      repriceDiff: { previousGrandTotal: 20000000, newGrandTotal: 20526000, delta: 526000 },
    },
    type: 'object',
    additionalProperties: true,
  })
  @IsObject()
  @IsNotEmpty()
  data: any;
}
