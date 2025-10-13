import { Calculation } from './calculation.entity';
export declare class CalculationGroup {
    id: number;
    name: string;
    slug: string;
    voltageType?: number;
    calculations: Calculation[];
}
