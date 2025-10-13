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
export declare class Setting {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    settings: EquipmentSettings;
}
