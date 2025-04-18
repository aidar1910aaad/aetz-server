import {
    Entity, PrimaryGeneratedColumn, Column,
    ManyToOne, CreateDateColumn
  } from 'typeorm';
  import { Calculation } from './calculation.entity';
  
  @Entity()
  export class CalculationLog {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => Calculation, calculation => calculation.logs, { onDelete: 'CASCADE' })
    calculation: Calculation;
  
    @Column()
    by: string;
  
    @Column()
    action: 'created' | 'updated' | 'deleted' | 'status_changed';
  
    @Column({ nullable: true })
    field: string;
  
    @Column({ nullable: true })
    oldValue: string;
  
    @Column({ nullable: true })
    newValue: string;
  
    @CreateDateColumn()
    timestamp: Date;
  }
  