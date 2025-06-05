import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BmzSettings } from './entities/bmz-settings.entity';
import { BmzAreaPrice } from './entities/bmz-area-price.entity';
import { BmzEquipment, EquipmentPriceType } from './entities/bmz-equipment.entity';
import { BmzWallThickness } from './entities/bmz-wall-thickness.entity';
import { UpdateBmzSettingsDto } from './dto/update-bmz-settings.dto';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { CreateAreaPriceDto } from './dto/create-area-price.dto';
import { CreateWallThicknessDto } from './dto/create-wall-thickness.dto';

@Injectable()
export class BmzSettingsService {
  constructor(
    @InjectRepository(BmzSettings)
    private readonly settingsRepository: Repository<BmzSettings>,
    @InjectRepository(BmzAreaPrice)
    private readonly areaPriceRepository: Repository<BmzAreaPrice>,
    @InjectRepository(BmzEquipment)
    private readonly equipmentRepository: Repository<BmzEquipment>,
    @InjectRepository(BmzWallThickness)
    private readonly wallThicknessRepository: Repository<BmzWallThickness>,
  ) {
    this.initializeSettings();
  }

  private async initializeSettings() {
    const settings = await this.settingsRepository.find();
    if (settings.length === 0) {
      const defaultSettings = new BmzSettings();
      defaultSettings.basePricePerSquareMeter = 2000;
      defaultSettings.areaPriceRanges = [];
      defaultSettings.equipment = [];
      defaultSettings.isActive = true;
      await this.settingsRepository.save(defaultSettings);
    }
  }

  async getSettings(): Promise<BmzSettings> {
    const settings = await this.settingsRepository.find();
    if (settings.length === 0) {
      throw new NotFoundException('Настройки БМЗ не найдены');
    }
    return settings[0];
  }

  async updateSettings(updateSettingsDto: UpdateBmzSettingsDto): Promise<BmzSettings> {
    const settings = await this.getSettings();
    
    // Проверяем корректность диапазонов цен
    for (const range of updateSettingsDto.areaPriceRanges) {
      if (range.minArea > range.maxArea) {
        throw new Error('Минимальная площадь не может быть больше максимальной');
      }
      if (range.minWallThickness > range.maxWallThickness) {
        throw new Error('Минимальная толщина стен не может быть больше максимальной');
      }
    }

    // Проверяем корректность оборудования
    for (const equipment of updateSettingsDto.equipment) {
      if (equipment.priceType === 'fixed' && !equipment.fixedPrice) {
        throw new Error('Для фиксированной цены необходимо указать fixedPrice');
      }
      if ((equipment.priceType === 'perSquareMeter' || equipment.priceType === 'perHalfSquareMeter') && 
          !equipment.pricePerSquareMeter) {
        throw new Error('Для цены за квадратный метр необходимо указать pricePerSquareMeter');
      }
    }

    Object.assign(settings, updateSettingsDto);
    return this.settingsRepository.save(settings);
  }

  async getAllSettings() {
    const [areaPrices, equipment, wallThicknesses] = await Promise.all([
      this.areaPriceRepository.find({
        where: { isActive: true },
        order: { minArea: 'ASC' }
      }),
      this.equipmentRepository.find({
        where: { isActive: true },
        order: { name: 'ASC' }
      }),
      this.wallThicknessRepository.find({
        where: { isActive: true },
        order: { minThickness: 'ASC' }
      })
    ]);

    return {
      areaPrices,
      equipment,
      wallThicknesses
    };
  }

  async createAreaPrice(data: {
    minArea: number;
    maxArea: number;
    minWallThickness: number;
    maxWallThickness: number;
    basePricePerSquareMeter: number;
  }) {
    const areaPrice = new BmzAreaPrice();
    Object.assign(areaPrice, {
      ...data,
      isActive: true
    });
    return this.areaPriceRepository.save(areaPrice);
  }

  async deleteAreaPrice(id: number) {
    const areaPrice = await this.areaPriceRepository.findOne({ where: { id } });
    if (!areaPrice) {
      throw new NotFoundException('Диапазон цен не найден');
    }
    areaPrice.isActive = false;
    return this.areaPriceRepository.save(areaPrice);
  }

  async createEquipment(data: {
    name: string;
    priceType: EquipmentPriceType;
    pricePerSquareMeter?: number;
    fixedPrice?: number;
    description: string;
  }) {
    if (data.priceType === EquipmentPriceType.FIXED && !data.fixedPrice) {
      throw new Error('Для фиксированной цены необходимо указать fixedPrice');
    }

    if ((data.priceType === EquipmentPriceType.PER_SQUARE_METER || 
         data.priceType === EquipmentPriceType.PER_HALF_SQUARE_METER) && 
        !data.pricePerSquareMeter) {
      throw new Error('Для цены за квадратный метр необходимо указать pricePerSquareMeter');
    }

    const equipment = new BmzEquipment();
    Object.assign(equipment, {
      ...data,
      isActive: true
    });
    return this.equipmentRepository.save(equipment);
  }

  async deleteEquipment(id: number) {
    const equipment = await this.equipmentRepository.findOne({ where: { id } });
    if (!equipment) {
      throw new NotFoundException('Оборудование не найдено');
    }
    equipment.isActive = false;
    return this.equipmentRepository.save(equipment);
  }

  async createWallThickness(data: CreateWallThicknessDto): Promise<BmzWallThickness> {
    if (data.minThickness > data.maxThickness) {
      throw new Error('Минимальная толщина не может быть больше максимальной');
    }

    const wallThickness = new BmzWallThickness();
    wallThickness.minThickness = data.minThickness;
    wallThickness.maxThickness = data.maxThickness;
    wallThickness.pricePerSquareMeter = data.pricePerSquareMeter;
    wallThickness.isActive = true;

    return this.wallThicknessRepository.save(wallThickness);
  }

  async deleteWallThickness(id: number): Promise<void> {
    const wallThickness = await this.wallThicknessRepository.findOne({ where: { id } });
    if (!wallThickness) {
      throw new NotFoundException('Диапазон цен по толщине стен не найден');
    }

    wallThickness.isActive = false;
    await this.wallThicknessRepository.save(wallThickness);
  }
} 