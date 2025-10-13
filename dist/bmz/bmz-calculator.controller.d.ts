import { BmzCalculatorService } from './bmz-calculator.service';
export declare class BmzCalculatorController {
    private readonly calculatorService;
    constructor(calculatorService: BmzCalculatorService);
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
