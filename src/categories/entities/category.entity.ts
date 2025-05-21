import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { Material } from '../../materials/entities/material.entity';

@Entity()
export class Category {
  @PrimaryColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true, nullable: true })
  code: string;

  @Column({ nullable: true }) // ✅ описание необязательно
  description?: string;

  @OneToMany(() => Material, (material) => material.category)
  materials: Material[];
}
