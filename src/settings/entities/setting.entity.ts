import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export interface CategorySetting {
    categoryId: number;
    type: string;
    isVisible: boolean;
}

export interface EquipmentSettings {
    rusn: CategorySetting[];
    bmz: CategorySetting[];
    runn: CategorySetting[];
    work: CategorySetting[];
    transformer: CategorySetting[];
    additionalEquipment: CategorySetting[];
    sr: CategorySetting[];
    tsn: CategorySetting[];
    tn: CategorySetting[];
}

@Entity()
export class Setting {
    @PrimaryColumn()
    id: string = 'settings';

    @ApiProperty({ example: '2024-03-20T10:00:00Z', description: 'Дата создания' })
    @CreateDateColumn()
    createdAt: Date;

    @ApiProperty({ example: '2024-03-20T10:00:00Z', description: 'Дата последнего обновления' })
    @UpdateDateColumn()
    updatedAt: Date;

    @ApiProperty({
        description: 'Настройки оборудования',
        example: {
            rusn: [],
            bmz: [],
            runn: [],
            work: [],
            transformer: [],
            additionalEquipment: [],
            sr: [],
            tsn: [],
            tn: []
        }
    })
    @Column('jsonb')
    settings: EquipmentSettings;
} 