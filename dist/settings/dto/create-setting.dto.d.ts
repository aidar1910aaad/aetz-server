export declare class CategorySettingDto {
    categoryId: number;
    type: string;
    isVisible: boolean;
}
export declare class EquipmentSettingsDto {
    rusn: CategorySettingDto[];
    bmz: CategorySettingDto[];
    runn: CategorySettingDto[];
    work: CategorySettingDto[];
    transformer: CategorySettingDto[];
    additionalEquipment: CategorySettingDto[];
    sr: CategorySettingDto[];
    tsn: CategorySettingDto[];
    tn: CategorySettingDto[];
}
export declare class CreateSettingDto {
    settings: EquipmentSettingsDto;
}
