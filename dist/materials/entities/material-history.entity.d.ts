import { Material } from './material.entity';
export declare class MaterialHistory {
    id: number;
    material: Material;
    fieldChanged: string;
    oldValue: string;
    newValue: string;
    changedBy: string;
    changedAt: Date;
}
