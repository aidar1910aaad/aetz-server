import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Category } from '../../categories/entities/category.entity';

interface CategorySetting {
    categoryId: number;
    type: string;
    isVisible: boolean;
}

interface EquipmentSettings {
    rusn: CategorySetting[];
    bmz: CategorySetting[];
    runn: CategorySetting[];
    work: CategorySetting[];
    transformer: CategorySetting[];
    additionalEquipment: CategorySetting[];
}

@Entity()
export class Setting {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'json' })
    settings: EquipmentSettings;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
} 