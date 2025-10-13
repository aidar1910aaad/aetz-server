import { Repository } from 'typeorm';
import { CurrencySettings } from './entities/currency-settings.entity';
import { UpdateCurrencySettingsDto } from './dto/update-currency-settings.dto';
export declare class CurrencySettingsService {
    private readonly currencySettingsRepo;
    constructor(currencySettingsRepo: Repository<CurrencySettings>);
    private initializeSettings;
    getSettings(): Promise<CurrencySettings>;
    updateSettings(updateData: UpdateCurrencySettingsDto): Promise<CurrencySettings>;
}
