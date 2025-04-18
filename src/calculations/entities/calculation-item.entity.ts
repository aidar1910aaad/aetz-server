import {
    Entity, PrimaryGeneratedColumn, Column, ManyToOne
  } from 'typeorm';
  import { Calculation } from './calculation.entity';
  
  @Entity()
  export class CalculationItem {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => Calculation, calculation => calculation.items, { onDelete: 'CASCADE' })
    calculation: Calculation;
  
    @Column()
    type: 'material' | 'custom';
  
    @Column()
    title: string;
  
    @Column()
    unit: string;
  
    @Column('decimal')
    quantity: number;
  
    @Column('decimal')
    unitPrice: number;
  
    @Column('decimal')
    totalPrice: number;
  
    @Column({ nullable: true })
    materialId: number;
  }
  