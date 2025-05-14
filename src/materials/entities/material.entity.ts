import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
  } from 'typeorm';
  import { Category } from '../../categories/entities/category.entity';
  
  @Entity()
  export class Material {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    name: string;

    @Column({ nullable: true })
    code: string;
  
    @Column()
    unit: string;
  
    @Column('decimal')
    price: number;
  
    @ManyToOne(() => Category, (category) => category.materials, { eager: true })
    category: Category;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  }
  