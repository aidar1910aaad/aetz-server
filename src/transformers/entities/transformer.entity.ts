import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Transformer {
  @ApiProperty({ 
    example: 1, 
    description: 'Уникальный идентификатор' 
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ 
    example: 'ТСЛ-1250/20',
    description: 'Модель трансформатора (например: ТМГ-1000/10, ТСЛ-1250/20)'
  })
  @Column()
  model: string;

  @ApiProperty({ 
    example: '20',
    description: 'Номинальное напряжение (кВ). Примеры: 10, 20, 35, 110'
  })
  @Column()
  voltage: string;

  @ApiProperty({ 
    example: 'ТСЛ',
    description: 'Тип трансформатора. Примеры: ТМГ, ТСЛ, ТМЗ'
  })
  @Column()
  type: string;

  @ApiProperty({ 
    example: 1250,
    description: 'Мощность трансформатора (кВА). Примеры: 25, 40, 63, 100, 160, 250, 400, 630, 1000, 1250, 1600, 2000, 2500, 3150, 4000'
  })
  @Column()
  power: number;

  @ApiProperty({ 
    example: 'Alageum',
    description: 'Производитель трансформатора. Примеры: Alageum, ZBB'
  })
  @Column()
  manufacturer: string;

  @ApiProperty({ 
    example: 6996275,
    description: 'Цена трансформатора (тенге)'
  })
  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

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