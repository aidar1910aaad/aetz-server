import { Repository } from 'typeorm';
import { Material } from '../materials/entities/material.entity';
import { CalculationGroup } from './entities/calculation-group.entity';
import { Calculation } from './entities/calculation.entity';
import { CreateCalculationDto } from './dto/create-calculation.dto';
import { CreateCalculationGroupDto } from './dto/create-calculation-group.dto';
import { UpdateCalculationDto } from './dto/update-calculation.dto';
import { UpdateCalculationGroupDto } from './dto/update-calculation-group.dto';
export declare class CalculationsService {
    private readonly groupRepo;
    private readonly calcRepo;
    private readonly materialRepo;
    constructor(groupRepo: Repository<CalculationGroup>, calcRepo: Repository<Calculation>, materialRepo: Repository<Material>);
    private updateCellConfigPrices;
    createGroup(dto: CreateCalculationGroupDto): Promise<CalculationGroup>;
    getAllGroups(): Promise<CalculationGroup[]>;
    getGroupBySlug(slug: string): Promise<CalculationGroup>;
    createCalculation(dto: CreateCalculationDto): Promise<Calculation>;
    getCalculationsByGroupSlug(slug: string): Promise<Calculation[]>;
    getCalculation(groupSlug: string, calcSlug: string): Promise<Calculation>;
    updateCalculation(groupSlug: string, calcSlug: string, dto: UpdateCalculationDto): Promise<Calculation>;
    deleteCalculation(groupSlug: string, calcSlug: string): Promise<void>;
    deleteGroupById(id: number): Promise<void>;
    getAllCalculations(): Promise<Calculation[]>;
    updateGroup(slug: string, dto: UpdateCalculationGroupDto): Promise<CalculationGroup>;
}
