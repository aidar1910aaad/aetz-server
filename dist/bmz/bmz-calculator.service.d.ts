import { Repository } from 'typeorm';
import { BmzAreaPrice } from './entities/bmz-area-price.entity';
import { BmzWallThickness } from './entities/bmz-wall-thickness.entity';
import { BmzEquipment } from './entities/bmz-equipment.entity';
export declare class BmzCalculatorService {
    private readonly areaPriceRepository;
    private readonly wallThicknessRepository;
    private readonly equipmentRepository;
    constructor(areaPriceRepository: Repository<BmzAreaPrice>, wallThicknessRepository: Repository<BmzWallThickness>, equipmentRepository: Repository<BmzEquipment>);
    calculatePrice(params: {
        area: number;
        wallThickness: number;
        selectedEquipment: number[];
    }): Promise<{
        basePrice: number;
        wallThicknessPrice: number;
        equipment: {
            name: string;
            price: number;
            description: string;
        }[];
        totalPrice: number;
    }>;
}
