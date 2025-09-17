import { User } from '../../users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('bids')
export class Bid {
  @ApiProperty({ example: 1, description: 'Уникальный ID заявки' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ 
    example: 'BID-2024-001', 
    description: 'Уникальный номер заявки' 
  })
  @Column({ unique: true })
  bidNumber: string;

  @ApiProperty({ 
    example: 'БКТП', 
    description: 'Тип заявки' 
  })
  @Column()
  type: string;

  @ApiProperty({ 
    example: '2024-09-17', 
    description: 'Дата заявки' 
  })
  @Column()
  date: string;

  @ApiProperty({ 
    example: 'ООО Ромашка', 
    description: 'Название клиента' 
  })
  @Column()
  client: string;

  @ApiProperty({ 
    example: '12345', 
    description: 'Номер задачи' 
  })
  @Column()
  taskNumber: string;

  @ApiProperty({ 
    example: 52899246.59, 
    description: 'Общая сумма заявки' 
  })
  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  totalAmount: number;

  @ApiProperty({ 
    description: 'Все данные заявки (гибкая структура)', 
    example: {
      bmz: { 
        buildingType: 'bmz', 
        length: 5000, 
        width: 6000, 
        height: 3000, 
        thickness: 100,
        total: 1500000
      },
      transformer: { 
        selected: { id: 1, model: 'ТСЛ-1250/20', price: 19026000 }, 
        total: 19026000 
      },
      rusn: { 
        cellConfigs: [
          { type: '0.4kv', materials: { switch: { id: 1, name: 'Выключатель', price: 50000 } } }
        ], 
        busbarSummary: { total: 100000 },
        total: 150000 
      },
      runn: { 
        cellSummaries: [
          { type: '10kv', quantity: 2, total: 500000 }
        ], 
        total: 9088368.92 
      },
      additionalEquipment: { 
        selected: { id: 1, name: 'Вентиляция' }, 
        equipmentList: [
          { id: 1, name: 'Вентиляция', price: 50000 },
          { id: 2, name: 'Утепление', price: 30000 }
        ], 
        total: 80000 
      },
      works: { 
        selected: { id: 1, name: 'Монтаж' }, 
        worksList: [
          { id: 1, name: 'Монтаж БМЗ', price: 500000 },
          { id: 2, name: 'Монтаж трансформатора', price: 300000 }
        ], 
        total: 1865410 
      }
    },
    type: 'object',
    additionalProperties: true
  })
  @Column({ type: 'jsonb' })
  data: any;

  @ApiProperty({ 
    description: 'Информация о пользователе', 
    example: { id: 4, username: 'aidarr', firstName: 'Айдар', lastName: 'Айдарович' }
  })
  @Column({ type: 'jsonb' })
  user: any;

  @ManyToOne(() => User, (user) => user.bids, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'userId' })
  userEntity: User;

  @Column({ nullable: true })
  userId: number;

  @ApiProperty({ 
    example: '2024-09-17T10:00:00Z', 
    description: 'Дата создания заявки' 
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ 
    example: '2024-09-17T10:00:00Z', 
    description: 'Дата последнего обновления заявки' 
  })
  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  generateBidNumber() {
    if (!this.bidNumber) {
      const year = new Date().getFullYear();
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      this.bidNumber = `BID-${year}-${random}`;
    }
  }
} 