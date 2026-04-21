import { Repository } from 'typeorm';
import { CurrencySettings } from './entities/currency-settings.entity';
import { UpdateCurrencySettingsDto } from './dto/update-currency-settings.dto';
import { Material } from '../materials/entities/material.entity';
import { Calculation } from '../calculations/entities/calculation.entity';
export declare class CurrencySettingsService {
    private readonly currencySettingsRepo;
    private readonly materialRepo;
    private readonly calculationRepo;
    constructor(currencySettingsRepo: Repository<CurrencySettings>, materialRepo: Repository<Material>, calculationRepo: Repository<Calculation>);
    private toNumber;
    private getRateByCurrency;
    private convertToKzt;
    private recalculateMaterialsPriceInKzt;
    private updateCalculationDataByMaterials;
    private syncCalculationsWithCurrentMaterialPrices;
    private initializeSettings;
    getSettings(): Promise<CurrencySettings>;
    updateSettings(updateData: UpdateCurrencySettingsDto): Promise<CurrencySettings>;
}
