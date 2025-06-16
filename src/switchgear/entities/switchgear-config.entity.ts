import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('switchgear_configs')
export class SwitchgearConfig {
  @ApiProperty({
    example: 1,
    description: 'Уникальный идентификатор конфигурации',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'КСО 12-10',
    description: 'Тип ячейки РУ',
  })
  @Column()
  type: string;

  @ApiProperty({
    example: 'AV-12 1250',
    description: 'Модель выключателя',
  })
  @Column()
  breaker: string;

  @ApiProperty({
    example: 870,
    description: 'Номинальный ток в амперах',
  })
  @Column()
  amperage: number;

  @ApiProperty({
    example: 'АД',
    description: 'Группа ячеек',
  })
  @Column()
  group: string;

  @ApiProperty({
    example: '60x6',
    description: 'Размер шины',
  })
  @Column()
  busbar: string;

  @ApiProperty({
    example: [
      { name: 'Ввод', quantity: 2 },
      { name: 'СВ', quantity: 1 },
      { name: 'ОТХ', quantity: 10 }
    ],
    description: 'Список ячеек с их количеством',
  })
  @Column('jsonb')
  cells: {
    name: string;
    quantity: number;
  }[];

  @ApiProperty({
    example: '2024-03-10T12:00:00Z',
    description: 'Дата создания конфигурации',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    example: '2024-03-10T12:00:00Z',
    description: 'Дата последнего обновления конфигурации',
  })
  @UpdateDateColumn()
  updatedAt: Date;
} 