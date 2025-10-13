import { CurrencySettingsService } from './currency-settings.service';
import { CurrencySettings } from './entities/currency-settings.entity';
import { UpdateCurrencySettingsDto } from './dto/update-currency-settings.dto';
export declare class CurrencySettingsController {
    private readonly currencySettingsService;
    constructor(currencySettingsService: CurrencySettingsService);
    getSettings(): Promise<CurrencySettings>;
    updateSettings(updateData: UpdateCurrencySettingsDto): Promise<CurrencySettings>;
}
