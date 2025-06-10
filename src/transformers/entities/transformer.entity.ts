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
    description: 'Модель трансформатора'
  })
  @Column()
  model: string;

  @ApiProperty({ 
    example: '20',
    description: 'Номинальное напряжение'
  })
  @Column()
  voltage: string;

  @ApiProperty({ 
    example: 'ТСЛ',
    description: 'Тип трансформатора'
  })
  @Column()
  type: string;

  @ApiProperty({ 
    example: 1250,
    description: 'Мощность трансформатора'
  })
  @Column()
  power: number;

  @ApiProperty({ 
    example: 'Alageum',
    description: 'Производитель'
  })
  @Column()
  manufacturer: string;

  @ApiProperty({ 
    example: 6996275,
    description: 'Цена трансформатора'
  })
  @Column()
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