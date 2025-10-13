import { Repository } from 'typeorm';
import { SwitchgearConfig } from './entities/switchgear-config.entity';
import { CreateSwitchgearConfigDto } from './dto/create-switchgear-config.dto';
export declare class SwitchgearService {
    private readonly switchgearRepository;
    constructor(switchgearRepository: Repository<SwitchgearConfig>);
    create(createSwitchgearConfigDto: CreateSwitchgearConfigDto): Promise<SwitchgearConfig>;
    findAll(query: {
        type?: string;
        amperage?: number;
        group?: string;
    }): Promise<SwitchgearConfig[]>;
    findOne(id: number): Promise<SwitchgearConfig>;
    update(id: number, updateSwitchgearConfigDto: CreateSwitchgearConfigDto): Promise<SwitchgearConfig>;
    remove(id: number): Promise<void>;
}
