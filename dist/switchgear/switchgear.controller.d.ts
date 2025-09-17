import { SwitchgearService } from './switchgear.service';
import { CreateSwitchgearConfigDto } from './dto/create-switchgear-config.dto';
import { SwitchgearConfig } from './entities/switchgear-config.entity';
export declare class SwitchgearController {
    private readonly switchgearService;
    constructor(switchgearService: SwitchgearService);
    create(createSwitchgearConfigDto: CreateSwitchgearConfigDto): Promise<SwitchgearConfig>;
    findAll(type?: string, amperage?: number, group?: string): Promise<SwitchgearConfig[]>;
    findOne(id: number): Promise<SwitchgearConfig>;
    update(id: number, updateSwitchgearConfigDto: CreateSwitchgearConfigDto): Promise<SwitchgearConfig>;
    remove(id: number): Promise<void>;
}
