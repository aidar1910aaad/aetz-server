import { Repository } from 'typeorm';
import { BmzSettings } from './entities/bmz-settings.entity';
import { BmzAreaPrice } from './entities/bmz-area-price.entity';
import { BmzEquipment, EquipmentPriceType } from './entities/bmz-equipment.entity';
import { BmzWallThickness } from './entities/bmz-wall-thickness.entity';
import { UpdateBmzSettingsDto } from './dto/update-bmz-settings.dto';
import { CreateWallThicknessDto } from './dto/create-wall-thickness.dto';
export declare class BmzSettingsService {
    private readonly settingsRepository;
    private readonly areaPriceRepository;
    private readonly equipmentRepository;
    private readonly wallThicknessRepository;
    constructor(settingsRepository: Repository<BmzSettings>, areaPriceRepository: Repository<BmzAreaPrice>, equipmentRepository: Repository<BmzEquipment>, wallThicknessRepository: Repository<BmzWallThickness>);
    private initializeSettings;
    getSettings(): Promise<BmzSettings>;
    updateSettings(updateSettingsDto: UpdateBmzSettingsDto): Promise<BmzSettings>;
    getAllSettings(): Promise<{
        areaPrices: BmzAreaPrice[];
        equipment: BmzEquipment[];
        wallThicknesses: BmzWallThickness[];
    }>;
    createAreaPrice(data: {
        minArea: number;
        maxArea: number;
        minWallThickness: number;
        maxWallThickness: number;
        basePricePerSquareMeter: number;
    }): Promise<BmzAreaPrice>;
    deleteAreaPrice(id: number): Promise<BmzAreaPrice>;
    createEquipment(data: {
        name: string;
        priceType: EquipmentPriceType;
        pricePerSquareMeter?: number;
        fixedPrice?: number;
        description: string;
    }): Promise<BmzEquipment>;
    deleteEquipment(id: number): Promise<BmzEquipment>;
    createWallThickness(data: CreateWallThicknessDto): Promise<BmzWallThickness>;
    deleteWallThickness(id: number): Promise<void>;
}
