import { User } from '../../users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('bids')
export class Bid {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'jsonb' })
  meta: any;

  @Column({ type: 'jsonb', nullable: true })
  bmz: any;

  @Column({ type: 'jsonb', nullable: true })
  transformer: any;

  @Column({ type: 'jsonb', nullable: true })
  rusn: any;

  @Column({ type: 'jsonb', nullable: true })
  additionalEquipment: any;

  @Column({ type: 'jsonb', nullable: true })
  works: any;

  @Column({ type: 'jsonb', nullable: true })
  totals: any;

  @ManyToOne(() => User, (user) => user.bids, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: true })
  userId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 