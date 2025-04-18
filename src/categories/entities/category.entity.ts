import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Material } from '../../materials/entities/material.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => Material, (material) => material.category)
  materials: Material[];
}
