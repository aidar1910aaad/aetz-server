import { CalculationGroup } from './calculation-group.entity';
export declare class Calculation {
    id: number;
    name: string;
    slug: string;
    group: CalculationGroup;
    data: any;
    createdAt: Date;
    updatedAt: Date;
}
