import { Repository } from 'typeorm';
import { Setting } from './entities/setting.entity';
import { CreateSettingDto } from './dto/create-setting.dto';
import { Category } from '../categories/entities/category.entity';
export declare class SettingsService {
    private readonly settingRepo;
    private readonly categoryRepo;
    constructor(settingRepo: Repository<Setting>, categoryRepo: Repository<Category>);
    private initializeSettings;
    create(dto: CreateSettingDto): Promise<Setting>;
    getSettings(): Promise<Setting>;
    update(dto: CreateSettingDto): Promise<Setting>;
    reset(): Promise<Setting>;
}
