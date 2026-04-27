import { MaterialsService } from './materials.service';
import { Material } from './entities/material.entity';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
export declare class MaterialsController {
    private readonly materialsService;
    constructor(materialsService: MaterialsService);
    create(dto: CreateMaterialDto, user: JwtPayload): Promise<Material & {
        currentPriceKzt: number;
    }>;
    createMany(dtos: CreateMaterialDto[], user: JwtPayload): Promise<Material[]>;
    findAll(page?: number, limit?: number, search?: string, sort?: 'name' | 'price' | 'code', order?: 'ASC' | 'DESC', categoryId?: number): Promise<{
        data: Array<Material & {
            currentPriceKzt: number;
        }>;
        total: number;
    }>;
    getRecentHistory(page?: number, limit?: number, materialId?: number, fieldChanged?: string, changedBy?: string, dateFrom?: string, dateTo?: string, search?: string): Promise<{
        data: import("./entities/material-history.entity").MaterialHistory[];
        total: number;
    }>;
    findOne(id: number): Promise<Material & {
        currentPriceKzt: number;
    }>;
    update(id: number, dto: UpdateMaterialDto, user: JwtPayload): Promise<Material & {
        currentPriceKzt: number;
    }>;
    getHistory(id: number): Promise<import("./entities/material-history.entity").MaterialHistory[]>;
    delete(id: number, user: JwtPayload): Promise<void>;
}
