import { Material } from '../../materials/entities/material.entity';
export declare class Category {
    id: number;
    name: string;
    code: string;
    description?: string;
    materials: Material[];
}
