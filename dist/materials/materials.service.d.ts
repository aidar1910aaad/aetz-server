import { Repository } from 'typeorm';
import { Material } from './entities/material.entity';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { MaterialHistory } from './entities/material-history.entity';
export declare class MaterialsService {
    private readonly materialRepo;
    private readonly historyRepo;
    constructor(materialRepo: Repository<Material>, historyRepo: Repository<MaterialHistory>);
    create(dto: CreateMaterialDto): Promise<Material>;
    findAll(query: {
        page?: number;
        limit?: number;
        search?: string;
        sort?: 'name' | 'price' | 'code';
        order?: 'ASC' | 'DESC';
        categoryId?: number;
    }): Promise<{
        data: Material[];
        total: number;
    }>;
    findOne(id: number): Promise<Material>;
    createMany(dtos: CreateMaterialDto[]): Promise<Material[]>;
    update(id: number, dto: UpdateMaterialDto): Promise<Material>;
    getHistory(id: number): Promise<MaterialHistory[]>;
    delete(id: number): Promise<void>;
}
