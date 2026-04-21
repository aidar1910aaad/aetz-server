import { Repository } from 'typeorm';
import { Material } from './entities/material.entity';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { MaterialHistory } from './entities/material-history.entity';
import { CurrencySettingsService } from '../currency-settings/currency-settings.service';
import { Calculation } from '../calculations/entities/calculation.entity';
export declare class MaterialsService {
    private readonly materialRepo;
    private readonly historyRepo;
    private readonly calculationRepo;
    private readonly currencySettingsService;
    constructor(materialRepo: Repository<Material>, historyRepo: Repository<MaterialHistory>, calculationRepo: Repository<Calculation>, currencySettingsService: CurrencySettingsService);
    private toNumber;
    private getRateByCurrency;
    private convertToKzt;
    private enrichMaterialWithCurrentPrice;
    private enrichMaterialsWithCurrentPrices;
    private updateCalculationDataPriceByMaterialId;
    private syncMaterialPriceInCalculations;
    create(dto: CreateMaterialDto): Promise<Material & {
        currentPriceKzt: number;
    }>;
    findAll(query: {
        page?: number;
        limit?: number;
        search?: string;
        sort?: 'name' | 'price' | 'code';
        order?: 'ASC' | 'DESC';
        categoryId?: number;
    }): Promise<{
        data: Array<Material & {
            currentPriceKzt: number;
        }>;
        total: number;
    }>;
    findOne(id: number): Promise<Material & {
        currentPriceKzt: number;
    }>;
    createMany(dtos: CreateMaterialDto[]): Promise<Array<Material & {
        currentPriceKzt: number;
    }>>;
    update(id: number, dto: UpdateMaterialDto): Promise<Material & {
        currentPriceKzt: number;
    }>;
    getHistory(id: number): Promise<MaterialHistory[]>;
    getRecentHistory(query: {
        page?: number;
        limit?: number;
        materialId?: number;
        fieldChanged?: string;
        changedBy?: string;
        dateFrom?: string;
        dateTo?: string;
        search?: string;
    }): Promise<{
        data: MaterialHistory[];
        total: number;
    }>;
    delete(id: number): Promise<void>;
}
