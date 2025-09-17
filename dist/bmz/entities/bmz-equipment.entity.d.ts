export declare enum EquipmentPriceType {
    PER_SQUARE_METER = "perSquareMeter",
    PER_HALF_SQUARE_METER = "perHalfSquareMeter",
    FIXED = "fixed"
}
export declare class BmzEquipment {
    id: number;
    name: string;
    priceType: EquipmentPriceType;
    pricePerSquareMeter: number;
    fixedPrice: number;
    description: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
