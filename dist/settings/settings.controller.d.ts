import { SettingsService } from './settings.service';
import { Setting } from './entities/setting.entity';
import { CreateSettingDto } from './dto/create-setting.dto';
export declare class SettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
    getSettings(): Promise<Setting>;
    create(createSettingDto: CreateSettingDto): Promise<Setting>;
    update(updateSettingDto: CreateSettingDto): Promise<Setting>;
}
