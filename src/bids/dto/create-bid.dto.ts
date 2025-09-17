import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsObject,
  IsOptional,
  IsNotEmpty,
  IsString,
  IsNumber,
} from 'class-validator';

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
    description: 'Тип заявки' 
  })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ 
    example: '2025-09-17', 
    description: 'Дата заявки' 
  })
  @IsString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({ 
    example: 'фывафыва', 
    description: 'Название клиента' 
  })
  @IsString()
  @IsNotEmpty()
  client: string;

  @ApiProperty({ 
    example: 'укфыва', 
    description: 'Номер задачи' 
  })
  @IsString()
  @IsNotEmpty()
  taskNumber: string;

  @ApiPropertyOptional({ 
    example: 52899246.5920094, 
    description: 'Общая сумма заявки' 
  })
  @IsOptional()
  @IsNumber()
  totalAmount?: number;

  @ApiProperty({ 
    description: 'Информация о пользователе', 
    type: UserDto
  })
  @IsObject()
  @IsNotEmpty()
  @Type(() => UserDto)
  user: UserDto;

  @ApiProperty({ 
    description: 'Все данные заявки (гибкая структура)', 
    example: {
      bmz: { 
        buildingType: 'bmz', 
        length: 5000, 
        width: 6000, 
        height: 3000, 
        thickness: 100,
        total: 1500000
      },
      transformer: { 
        selected: { id: 1, model: 'ТСЛ-1250/20', price: 19026000 }, 
        total: 19026000 
      },
      rusn: { 
        cellConfigs: [
          { type: '0.4kv', materials: { switch: { id: 1, name: 'Выключатель', price: 50000 } } }
        ], 
        busbarSummary: { total: 100000 },
        total: 150000 
      },
      runn: { 
        cellSummaries: [
          { type: '10kv', quantity: 2, total: 500000 }
        ], 
        total: 9088368.92 
      },
      additionalEquipment: { 
        selected: { id: 1, name: 'Вентиляция' }, 
        equipmentList: [
          { id: 1, name: 'Вентиляция', price: 50000 },
          { id: 2, name: 'Утепление', price: 30000 }
        ], 
        total: 80000 
      },
      works: { 
        selected: { id: 1, name: 'Монтаж' }, 
        worksList: [
          { id: 1, name: 'Монтаж БМЗ', price: 500000 },
          { id: 2, name: 'Монтаж трансформатора', price: 300000 }
        ], 
        total: 1865410 
      }
    },
    type: 'object',
    additionalProperties: true
  })
  @IsObject()
  @IsNotEmpty()
  data: any;
} 