export declare enum OptionType {
    PER_SQUARE_METER = "perSquareMeter",
    PER_HALF_SQUARE_METER = "perHalfSquareMeter",
    FIXED = "fixed"
}
export declare class BmzOption {
    id: number;
    name: string;
    type: OptionType;
    pricePerSquareMeter: number;
    fixedPrice: number;
    description: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
