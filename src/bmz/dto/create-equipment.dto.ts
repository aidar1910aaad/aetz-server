import { ApiProperty } from '@nestjs/swagger';
import { EquipmentPriceType } from '../entities/bmz-equipment.entity';

export class CreateEquipmentDto {
  @ApiProperty({
    description: 'Название оборудования',
    example: 'Утепление стен'
  })
  name: string;

  @ApiProperty({
    description: `Тип цены:
- perSquareMeter: цена за квадратный метр (требуется pricePerSquareMeter)
- perHalfSquareMeter: цена за полквадратного метра (требуется pricePerSquareMeter)
- fixed: фиксированная цена (требуется fixedPrice)`,
    enum: EquipmentPriceType,
    example: EquipmentPriceType.PER_SQUARE_METER
  })
  priceType: EquipmentPriceType;

  @ApiProperty({
    description: 'Цена за квадратный метр. Обязательно для типов perSquareMeter и perHalfSquareMeter',
    example: 1000,
    required: false
  })
  pricePerSquareMeter?: number;

  @ApiProperty({
    description: 'Фиксированная цена. Обязательно для типа fixed',
    example: 5000,
    required: false
  })
  fixedPrice?: number;

  @ApiProperty({
    description: 'Описание оборудования',
    example: 'Дополнительное утепление стен'
  })
  description: string;
} 