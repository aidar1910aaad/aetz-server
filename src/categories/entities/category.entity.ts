import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { Material } from '../../materials/entities/material.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity()
export class Category {
  @ApiProperty({ 
    example: 1, 
    description: 'Уникальный идентификатор категории',
    minimum: 1
  })
  @PrimaryColumn()
  id: number;

  @ApiProperty({ 
    example: 'Электрооборудование', 
    description: 'Название категории (уникальное)',
    minLength: 1,
    maxLength: 100
  })
  @Column({ unique: true })
  name: string;

  @ApiProperty({ 
    example: 'ELEC', 
    description: 'Уникальный код категории',
    maxLength: 10
  })
  @Column({ unique: true, nullable: true })
  code: string;

  @ApiPropertyOptional({ 
    example: 'Категория для электрооборудования и комплектующих', 
    description: 'Подробное описание категории',
    maxLength: 500
  })
  @Column({ nullable: true })
  description?: string;

  @ApiPropertyOptional({ 
    type: () => [Material],
    description: 'Список материалов в данной категории'
  })
  @OneToMany(() => Material, (material) => material.category)
  materials: Material[];
}
