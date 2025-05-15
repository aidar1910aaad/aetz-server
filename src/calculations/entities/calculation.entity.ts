import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { CalculationGroup } from './calculation-group.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Calculation {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Камера КСО А12-10 900×1000' })
  @Column()
  name: string;

  @ApiProperty({ example: '900x1000' })
  @Column()
  slug: string;

  @ManyToOne(() => CalculationGroup, (group) => group.calculations, { onDelete: 'CASCADE' })
  group: CalculationGroup;

  @ApiProperty({ example: { materials: [], total: 0 } })
  @Column('json')
  data: any;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
