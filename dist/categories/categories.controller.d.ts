import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Material } from '../materials/entities/material.entity';
import { Category } from './entities/category.entity';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    create(dto: CreateCategoryDto | CreateCategoryDto[]): Promise<Category> | Promise<Category[]>;
    findAll(): Promise<Category[]>;
    findOne(id: number): Promise<Category>;
    update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category>;
    remove(id: number): Promise<Category>;
    getMaterialsByCategory(id: number): Promise<Material[]>;
    removeMany(ids: number[]): Promise<import("typeorm").DeleteResult>;
}
