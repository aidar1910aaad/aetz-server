import { CalculationsService } from './calculations.service';
import { CreateCalculationDto } from './dto/create-calculation.dto';
import { CreateCalculationGroupDto } from './dto/create-calculation-group.dto';
import { UpdateCalculationDto } from './dto/update-calculation.dto';
import { UpdateCalculationGroupDto } from './dto/update-calculation-group.dto';
import { Calculation } from './entities/calculation.entity';
import { CalculationGroup } from './entities/calculation-group.entity';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
export declare class CalculationsController {
    private readonly calculationsService;
    constructor(calculationsService: CalculationsService);
    getAllGroups(): Promise<CalculationGroup[]>;
    updateGroup(slug: string, dto: UpdateCalculationGroupDto): Promise<CalculationGroup>;
    createCalculation(dto: CreateCalculationDto, user: JwtPayload): Promise<Calculation>;
    createGroup(dto: CreateCalculationGroupDto): Promise<CalculationGroup>;
    getAllCalculations(): Promise<Calculation[]>;
    deleteGroupById(id: number): Promise<void>;
    getOne(groupSlug: string, calcSlug: string): Promise<Calculation>;
    getGroupCalculations(slug: string): Promise<Calculation[]>;
    updateCalculation(groupSlug: string, calcSlug: string, dto: UpdateCalculationDto, user: JwtPayload): Promise<Calculation>;
    deleteCalculation(groupSlug: string, calcSlug: string, user: JwtPayload): Promise<void>;
}
