import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class BmzWallThickness {
  @ApiProperty({ 
    example: 1, 
    description: 'Уникальный идентификатор' 
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ 
    example: 0,
    description: 'Минимальная толщина стены (мм)'
  })
  @Column()
  minThickness: number;

  @ApiProperty({ 
    example: 80,
    description: 'Максимальная толщина стены (мм)'
  })
  @Column()
  maxThickness: number;

  @ApiProperty({ 
    example: 2000,
    description: 'Дополнительная цена за квадратный метр'
  })
  @Column('decimal', { precision: 10, scale: 2 })
  pricePerSquareMeter: number;

  @ApiProperty({ 
    example: true,
    description: 'Активна ли настройка'
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