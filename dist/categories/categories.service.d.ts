import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Material } from '../materials/entities/material.entity';
export declare class CategoriesService {
    private readonly categoryRepo;
    private readonly materialRepo;
    constructor(categoryRepo: Repository<Category>, materialRepo: Repository<Material>);
    create(dto: CreateCategoryDto): Promise<Category>;
    createMany(dtos: CreateCategoryDto[]): Promise<Category[]>;
    findAll(): Promise<Category[]>;
    findOne(id: number): Promise<Category>;
    findMaterialsByCategoryId(categoryId: number): Promise<Material[]>;
    update(id: number, dto: UpdateCategoryDto): Promise<Category>;
    remove(id: number): Promise<Category>;
    removeMany(ids: number[]): Promise<import("typeorm").DeleteResult>;
}
