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

  @ApiProperty({ 
    example: 10, 
    description: 'Тип вольтажа (например: 10, 20, 35 и т.д.)',
    required: false 
  })
  @Column({ nullable: true })
  voltageType?: number;

  @OneToMany(() => Calculation, (calc) => calc.group)
  calculations: Calculation[];
}
