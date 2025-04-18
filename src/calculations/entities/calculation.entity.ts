import {
    Entity, PrimaryGeneratedColumn, Column,
    CreateDateColumn, UpdateDateColumn, OneToMany
  } from 'typeorm';
  import { CalculationItem } from './calculation-item.entity';
  import { CalculationLog } from './calculation-log.entity';
  import { CalculationStatus } from '../calculation-status.enum';
  
  @Entity()
  export class Calculation {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    name: string;
  
    @Column({ type: 'enum', enum: CalculationStatus, default: CalculationStatus.DRAFT })
    status: CalculationStatus;
  
    @Column()
    createdBy: string;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    @OneToMany(() => CalculationItem, item => item.calculation, { cascade: true })
    items: CalculationItem[];
  
    @OneToMany(() => CalculationLog, log => log.calculation, { cascade: true })
    logs: CalculationLog[];
  }
  