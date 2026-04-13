import { Repository } from 'typeorm';
import { CurrencySettings } from './entities/currency-settings.entity';
import { UpdateCurrencySettingsDto } from './dto/update-currency-settings.dto';
import { Material } from '../materials/entities/material.entity';
export declare class CurrencySettingsService {
    private readonly currencySettingsRepo;
    private readonly materialRepo;
    constructor(currencySettingsRepo: Repository<CurrencySettings>, materialRepo: Repository<Material>);
    private toNumber;
    private getRateByCurrency;
    private convertToKzt;
    private recalculateMaterialsPriceInKzt;
    private initializeSettings;
    getSettings(): Promise<CurrencySettings>;
    updateSettings(updateData: UpdateCurrencySettingsDto): Promise<CurrencySettings>;
}
