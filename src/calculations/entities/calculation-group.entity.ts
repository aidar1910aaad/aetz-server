import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Calculation } from './calculation.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class CalculationGroup {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Камера КСО А12-10' })
  @Column()
  name: string;

  @ApiProperty({ example: 'kso-a12-10' })
  @Column({ unique: true })
  slug: string;

  @OneToMany(() => Calculation, (calc) => calc.group)
  calculations: Calculation[];
}
