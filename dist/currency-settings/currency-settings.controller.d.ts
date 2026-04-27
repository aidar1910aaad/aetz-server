import { CurrencySettingsService } from './currency-settings.service';
import { CurrencySettings } from './entities/currency-settings.entity';
import { UpdateCurrencySettingsDto } from './dto/update-currency-settings.dto';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
export declare class CurrencySettingsController {
    private readonly currencySettingsService;
    private readonly logger;
    constructor(currencySettingsService: CurrencySettingsService);
    getSettings(): Promise<CurrencySettings>;
    updateSettings(updateData: UpdateCurrencySettingsDto, user: JwtPayload): Promise<CurrencySettings>;
}
