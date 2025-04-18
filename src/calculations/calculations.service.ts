import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Calculation } from './entities/calculation.entity';
import { CalculationItem } from './entities/calculation-item.entity';
import { CalculationLog } from './entities/calculation-log.entity';
import { CreateCalculationDto } from './dto/create-calculation.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { UpdateCalculationDto } from './dto/update-calculation.dto';


@Injectable()
export class CalculationsService {
  constructor(
    @InjectRepository(Calculation)
    private readonly calcRepo: Repository<Calculation>,
    @InjectRepository(CalculationItem)
    private readonly itemRepo: Repository<CalculationItem>,
    @InjectRepository(CalculationLog)
    private readonly logRepo: Repository<CalculationLog>,
  ) {}

  async create(dto: CreateCalculationDto): Promise<Calculation> {
    const items = dto.items.map((item) => {
      const total = Number(item.unitPrice) * Number(item.quantity);
      return this.itemRepo.create({
        ...item,
        totalPrice: total,
      });
    });

    const calculation = this.calcRepo.create({
      name: dto.name,
      createdBy: dto.createdBy,
      items,
    });

    const saved = await this.calcRepo.save(calculation);

    await this.logRepo.save({
      calculation: saved,
      by: dto.createdBy,
      action: 'created',
    });

    return saved;
  }

  async findOne(id: number): Promise<Calculation> {
    const calc = await this.calcRepo.findOne({
      where: { id },
      relations: ['items'],
    });
  
    if (!calc) {
      throw new NotFoundException('Калькуляция не найдена');
    }
  
    return calc;
  }

  async updateStatus(id: number, dto: UpdateStatusDto): Promise<Calculation> {
    const calc = await this.calcRepo.findOneBy({ id });

    if (!calc) throw new Error('Калькуляция не найдена');

    const prevStatus = calc.status;
    calc.status = dto.status;

    const saved = await this.calcRepo.save(calc);

    await this.logRepo.save({
      calculation: saved,
      by: dto.changedBy,
      action: 'status_changed',
      field: 'status',
      oldValue: prevStatus,
      newValue: dto.status,
    });

    return saved;
  }

  async getLogs(id: number): Promise<CalculationLog[]> {
    return this.logRepo.find({
      where: { calculation: { id } },
      order: { timestamp: 'DESC' },
    });
  }

  async update(id: number, dto: UpdateCalculationDto): Promise<Calculation> {
    const calc = await this.calcRepo.findOne({
      where: { id },
      relations: ['items'],
    });
  
    if (!calc) throw new Error('Калькуляция не найдена');
  
    // Обновление имени
    if (dto.name && dto.name !== calc.name) {
      await this.logRepo.save({
        calculation: calc,
        by: dto.changedBy || 'неизвестный',
        action: 'updated',
        field: 'name',
        oldValue: calc.name,
        newValue: dto.name,
      });
      calc.name = dto.name;
    }
  
    // Обновление позиций (перезапись)
    if (dto.items && dto.items.length > 0) {
      // Удалим старые
      await this.itemRepo.delete({ calculation: { id: calc.id } });
  
      // Добавим новые
      const newItems = dto.items.map((item) => {
        const total = Number(item.unitPrice) * Number(item.quantity);
        return this.itemRepo.create({
          ...item,
          totalPrice: total,
          calculation: calc,
        });
      });
  
      calc.items = await this.itemRepo.save(newItems);
  
      await this.logRepo.save({
        calculation: calc,
        by: dto.changedBy || 'неизвестный',
        action: 'updated',
        field: 'items',
        oldValue: `Перезаписано ${calc.items.length} позиций`,
        newValue: `Добавлено ${newItems.length} позиций`,
      });
    }
  
    return this.calcRepo.save(calc);
  }
}
