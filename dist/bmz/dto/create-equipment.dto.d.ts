import { EquipmentPriceType } from '../entities/bmz-equipment.entity';
export declare class CreateEquipmentDto {
    name: string;
    priceType: EquipmentPriceType;
    pricePerSquareMeter?: number;
    fixedPrice?: number;
    description: string;
}
