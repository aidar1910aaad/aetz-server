import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('bmz_settings')
export class BmzSettings {
  @ApiProperty({
    description: 'Уникальный идентификатор настроек',
    example: 1
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Базовая цена за квадратный метр',
    example: 2000
  })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  basePricePerSquareMeter: number;

  @ApiProperty({
    description: 'Диапазоны цен по площади и толщине стен',
    type: 'array',
    example: [
      {
        minArea: 0,
        maxArea: 50,
        minWallThickness: 0,
        maxWallThickness: 50,
        pricePerSquareMeter: 25000
      },
      {
        minArea: 50,
        maxArea: 100,
        minWallThickness: 0,
        maxWallThickness: 50,
        pricePerSquareMeter: 23000
      }
    ]
  })
  @Column('jsonb', { default: [] })
  areaPriceRanges: Array<{
    minArea: number;
    maxArea: number;
    minWallThickness: number;
    maxWallThickness: number;
    pricePerSquareMeter: number;
  }>;

  @ApiProperty({
    description: 'Дополнительное оборудование',
    type: 'array',
    example: [
      {
        name: 'Утепление стен',
        priceType: 'perSquareMeter',
        pricePerSquareMeter: 1000,
        description: 'Дополнительное утепление стен'
      },
      {
        name: 'Вентиляция',
        priceType: 'fixed',
        fixedPrice: 5000,
        description: 'Система вентиляции'
      }
    ]
  })
  @Column('jsonb', { default: [] })
  equipment: Array<{
    name: string;
    priceType: 'perSquareMeter' | 'perHalfSquareMeter' | 'fixed';
    pricePerSquareMeter?: number;
    fixedPrice?: number;
    description: string;
  }>;

  @ApiProperty({
    description: 'Активны ли настройки',
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