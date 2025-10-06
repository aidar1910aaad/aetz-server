declare class AreaPriceRangeDto {
    minArea: number;
    maxArea: number;
    minWallThickness: number;
    maxWallThickness: number;
    pricePerSquareMeter: number;
}
declare class EquipmentDto {
    name: string;
    priceType: 'perSquareMeter' | 'perHalfSquareMeter' | 'fixed';
    pricePerSquareMeter?: number;
    fixedPrice?: number;
    description: string;
}
export declare class UpdateBmzSettingsDto {
    basePricePerSquareMeter: number;
    areaPriceRanges: AreaPriceRangeDto[];
    equipment: EquipmentDto[];
    isActive?: boolean;
}
export {};
