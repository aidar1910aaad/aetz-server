import { MaterialsService } from './materials.service';
import { Material } from './entities/material.entity';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
export declare class MaterialsController {
    private readonly materialsService;
    constructor(materialsService: MaterialsService);
    create(dto: CreateMaterialDto): Promise<Material>;
    createMany(dtos: CreateMaterialDto[]): Promise<Material[]>;
    findAll(page?: number, limit?: number, search?: string, sort?: 'name' | 'price' | 'code', order?: 'ASC' | 'DESC', categoryId?: number): Promise<{
        data: Material[];
        total: number;
    }>;
    getRecentHistory(): Promise<import("./entities/material-history.entity").MaterialHistory[]>;
    findOne(id: number): Promise<Material>;
    update(id: number, dto: UpdateMaterialDto): Promise<Material>;
    getHistory(id: number): Promise<import("./entities/material-history.entity").MaterialHistory[]>;
    delete(id: number): Promise<void>;
}
