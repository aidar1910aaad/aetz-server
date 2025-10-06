export declare class BmzSettings {
    id: number;
    basePricePerSquareMeter: number;
    areaPriceRanges: Array<{
        minArea: number;
        maxArea: number;
        minWallThickness: number;
        maxWallThickness: number;
        pricePerSquareMeter: number;
    }>;
    equipment: Array<{
        name: string;
        priceType: 'perSquareMeter' | 'perHalfSquareMeter' | 'fixed';
        pricePerSquareMeter?: number;
        fixedPrice?: number;
        description: string;
    }>;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
