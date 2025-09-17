import { BmzSettingsService } from './bmz-settings.service';
import { UpdateBmzSettingsDto } from './dto/update-bmz-settings.dto';
import { BmzSettings } from './entities/bmz-settings.entity';
export declare class BmzSettingsController {
    private readonly bmzSettingsService;
    constructor(bmzSettingsService: BmzSettingsService);
    getSettings(): Promise<BmzSettings>;
    updateSettings(updateSettingsDto: UpdateBmzSettingsDto): Promise<BmzSettings>;
}
