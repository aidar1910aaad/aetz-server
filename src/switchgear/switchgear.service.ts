import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SwitchgearConfig } from './entities/switchgear-config.entity';
import { CreateSwitchgearConfigDto } from './dto/create-switchgear-config.dto';

@Injectable()
export class SwitchgearService {
  constructor(
    @InjectRepository(SwitchgearConfig)
    private readonly switchgearRepository: Repository<SwitchgearConfig>,
  ) {}

  async create(createSwitchgearConfigDto: CreateSwitchgearConfigDto): Promise<SwitchgearConfig> {
    const config = this.switchgearRepository.create(createSwitchgearConfigDto);
    return this.switchgearRepository.save(config);
  }

  async findAll(query: { type?: string; amperage?: number; group?: string }): Promise<SwitchgearConfig[]> {
    const qb = this.switchgearRepository.createQueryBuilder('config');
    
    if (query.type) {
      qb.andWhere('config.type = :type', { type: query.type });
    }
    if (query.amperage) {
      qb.andWhere('config.amperage = :amperage', { amperage: query.amperage });
    }
    if (query.group) {
      qb.andWhere('config.group = :group', { group: query.group });
    }

    return qb.getMany();
  }

  async findOne(id: number): Promise<SwitchgearConfig> {
    const config = await this.switchgearRepository.findOne({ where: { id } });
    if (!config) {
      throw new NotFoundException(`Конфигурация с ID ${id} не найдена`);
    }
    return config;
  }

  async update(id: number, updateSwitchgearConfigDto: CreateSwitchgearConfigDto): Promise<SwitchgearConfig> {
    const config = await this.findOne(id);
    Object.assign(config, updateSwitchgearConfigDto);
    return this.switchgearRepository.save(config);
  }

  async remove(id: number): Promise<void> {
    const result = await this.switchgearRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Конфигурация с ID ${id} не найдена`);
    }
  }
} 