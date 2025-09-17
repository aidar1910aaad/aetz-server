import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsObject } from 'class-validator';

export class UpdateBidDto {
  @ApiPropertyOptional({ 
    example: 'БКТП', 
    description: 'Тип заявки' 
  })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional({ 
    example: '2025-09-17', 
    description: 'Дата заявки' 
  })
  @IsOptional()
  @IsString()
  date?: string;

  @ApiPropertyOptional({ 
    example: 'фывафыва', 
    description: 'Название клиента' 
  })
  @IsOptional()
  @IsString()
  client?: string;

  @ApiPropertyOptional({ 
    example: 'укфыва', 
    description: 'Номер задачи' 
  })
  @IsOptional()
  @IsString()
  taskNumber?: string;

  @ApiPropertyOptional({ 
    example: 52899246.5920094, 
    description: 'Общая сумма заявки' 
  })
  @IsOptional()
  @IsNumber()
  totalAmount?: number;

  @ApiPropertyOptional({ 
    description: 'Информация о пользователе' 
  })
  @IsOptional()
  @IsObject()
  user?: any;

  @ApiPropertyOptional({ 
    description: 'Все данные заявки (гибкая структура)', 
    example: {
      bmz: { buildingType: 'bmz', length: 5000, width: 6000 },
      transformer: { selected: {}, total: 19026000 },
      rusn: { cellConfigs: [], total: 0 },
      runn: { cellSummaries: [], total: 0 },
      additionalEquipment: { selected: {}, equipmentList: [], total: 0 },
      works: { selected: {}, worksList: [], total: 0 }
    }
  })
  @IsOptional()
  @IsObject()
  data?: any;
} 