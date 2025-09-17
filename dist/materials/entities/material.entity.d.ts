import { Category } from '../../categories/entities/category.entity';
export declare class Material {
    id: number;
    name: string;
    code: string;
    unit: string;
    price: number;
    category: Category;
    createdAt: Date;
    updatedAt: Date;
}
