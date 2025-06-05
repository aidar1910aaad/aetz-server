import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum OptionType {
  PER_SQUARE_METER = 'perSquareMeter',
  PER_HALF_SQUARE_METER = 'perHalfSquareMeter',
  FIXED = 'fixed'
}

@Entity()
export class BmzOption {
  @ApiProperty({ 
    example: 1, 
    description: 'Уникальный идентификатор' 
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ 
    example: 'Освещение',
    description: 'Название опции'
  })
  @Column()
  name: string;

  @ApiProperty({ 
    example: 'perSquareMeter',
    description: 'Тип расчета цены: perSquareMeter - за м², perHalfSquareMeter - за 0.5 м², fixed - фиксированная цена',
    enum: OptionType
  })
  @Column({
    type: 'enum',
    enum: OptionType
  })
  type: OptionType;

  @ApiProperty({ 
    example: 2500,
    description: 'Цена за квадратный метр (если тип perSquareMeter или perHalfSquareMeter)'
  })
  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  pricePerSquareMeter: number;

  @ApiProperty({ 
    example: 10000,
    description: 'Фиксированная цена (если тип fixed)'
  })
  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  fixedPrice: number;

  @ApiProperty({ 
    example: 'Освещение помещения',
    description: 'Описание опции'
  })
  @Column()
  description: string;

  @ApiProperty({ 
    example: true,
    description: 'Активна ли опция'
  })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({ 
    example: '2024-03-20T10:00:00Z',
    description: 'Дата создания записи'
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ 
    example: '2024-03-20T10:00:00Z',
    description: 'Дата последнего обновления записи'
  })
  @UpdateDateColumn()
  updatedAt: Date;
} 