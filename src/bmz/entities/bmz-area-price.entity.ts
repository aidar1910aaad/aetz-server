import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('bmz_area_prices')
export class BmzAreaPrice {
  @ApiProperty({
    description: 'Уникальный идентификатор',
    example: 1
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Минимальная площадь (м²)',
    example: 0
  })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  minArea: number;

  @ApiProperty({
    description: 'Максимальная площадь (м²)',
    example: 100
  })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  maxArea: number;

  @ApiProperty({
    description: 'Минимальная толщина стен (мм)',
    example: 0
  })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  minWallThickness: number;

  @ApiProperty({
    description: 'Максимальная толщина стен (мм)',
    example: 80
  })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  maxWallThickness: number;

  @ApiProperty({
    description: 'Базовая цена за квадратный метр',
    example: 2000
  })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  basePricePerSquareMeter: number;

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