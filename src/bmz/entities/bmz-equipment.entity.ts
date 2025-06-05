import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum EquipmentPriceType {
  PER_SQUARE_METER = 'perSquareMeter',
  PER_HALF_SQUARE_METER = 'perHalfSquareMeter',
  FIXED = 'fixed'
}

@Entity('bmz_equipment')
export class BmzEquipment {
  @ApiProperty({
    description: 'Уникальный идентификатор',
    example: 1
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Название оборудования',
    example: 'Утепление стен'
  })
  @Column()
  name: string;

  @ApiProperty({
    description: `Тип цены:
- perSquareMeter: цена за квадратный метр (требуется pricePerSquareMeter)
- perHalfSquareMeter: цена за полквадратного метра (требуется pricePerSquareMeter)
- fixed: фиксированная цена (требуется fixedPrice)`,
    enum: EquipmentPriceType,
    example: EquipmentPriceType.PER_SQUARE_METER
  })
  @Column({
    type: 'enum',
    enum: EquipmentPriceType,
    default: EquipmentPriceType.PER_SQUARE_METER
  })
  priceType: EquipmentPriceType;

  @ApiProperty({
    description: 'Цена за квадратный метр. Обязательно для типов perSquareMeter и perHalfSquareMeter',
    example: 1000,
    required: false
  })
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  pricePerSquareMeter: number;

  @ApiProperty({
    description: 'Фиксированная цена. Обязательно для типа fixed',
    example: 5000,
    required: false
  })
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  fixedPrice: number;

  @ApiProperty({
    description: 'Описание оборудования',
    example: 'Дополнительное утепление стен'
  })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({
    description: 'Активен ли элемент',
    example: true
  })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({
    description: 'Дата создания'
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Дата обновления'
  })
  @UpdateDateColumn()
  updatedAt: Date;
} 