

import {
    Entity, PrimaryGeneratedColumn, Column,
    CreateDateColumn, ManyToOne
  } from 'typeorm';
  import { Material } from './material.entity';
  
  @Entity()
  export class MaterialHistory {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => Material, { onDelete: 'CASCADE' })
    material: Material;
  
    @Column()
    fieldChanged: string;
  
    @Column()
    oldValue: string;
  
    @Column()
    newValue: string;
  
    @Column()
    changedBy: string;
  
    @CreateDateColumn()
    changedAt: Date;
  }
  