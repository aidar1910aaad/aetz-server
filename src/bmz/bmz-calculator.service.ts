import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual, In } from 'typeorm';
import { BmzAreaPrice } from './entities/bmz-area-price.entity';
import { BmzWallThickness } from './entities/bmz-wall-thickness.entity';
import { BmzEquipment } from './entities/bmz-equipment.entity';

@Injectable()
export class BmzCalculatorService {
  constructor(
    @InjectRepository(BmzAreaPrice)
    private readonly areaPriceRepository: Repository<BmzAreaPrice>,
    @InjectRepository(BmzWallThickness)
    private readonly wallThicknessRepository: Repository<BmzWallThickness>,
    @InjectRepository(BmzEquipment)
    private readonly equipmentRepository: Repository<BmzEquipment>,
  ) {}

  async calculatePrice(params: {
    area: number;
    wallThickness: number;
    selectedEquipment: number[];
  }) {
    // Находим подходящую цену за площадь
    const areaPrice = await this.areaPriceRepository.findOne({
      where: {
        isActive: true,
        minArea: LessThanOrEqual(params.area),
        maxArea: MoreThanOrEqual(params.area)
      }
    });

    if (!areaPrice) {
      throw new NotFoundException('Не найдена цена для указанной площади');
    }

    // Находим подходящую цену за толщину стен
    const wallThickness = await this.wallThicknessRepository.findOne({
      where: {
        isActive: true,
        minThickness: LessThanOrEqual(params.wallThickness),
        maxThickness: MoreThanOrEqual(params.wallThickness)
      }
    });

    if (!wallThickness) {
      throw new NotFoundException('Не найдена цена для указанной толщины стен');
    }

    // Находим выбранное оборудование
    const equipment = await this.equipmentRepository.find({
      where: {
        id: In(params.selectedEquipment),
        isActive: true
      }
    });

    if (equipment.length !== params.selectedEquipment.length) {
      throw new NotFoundException('Не все выбранное оборудование найдено');
    }

    // Рассчитываем базовую цену
    const basePrice = areaPrice.basePricePerSquareMeter * params.area;

    // Рассчитываем цену за толщину стен
    const wallThicknessPrice = wallThickness.pricePerSquareMeter * params.area;

    // Рассчитываем цену оборудования
    const equipmentDetails = equipment.map(eq => {
      let price = 0;
      let description = '';

      switch (eq.priceType) {
        case 'perSquareMeter':
          price = eq.pricePerSquareMeter * params.area;
          description = `${params.area} м² × ${eq.pricePerSquareMeter} ₽/м²`;
          break;
        case 'perHalfSquareMeter':
          price = eq.pricePerSquareMeter * (params.area / 2);
          description = `(${params.area} м² / 2) × ${eq.pricePerSquareMeter} ₽/м²`;
          break;
        case 'fixed':
          price = eq.fixedPrice;
          description = `Фиксированная цена: ${eq.fixedPrice} ₽`;
          break;
      }

      return {
        name: eq.name,
        price,
        description
      };
    });

    // Рассчитываем общую цену
    const totalPrice = basePrice + wallThicknessPrice + equipmentDetails.reduce((sum, eq) => sum + eq.price, 0);

    return {
      basePrice,
      wallThicknessPrice,
      equipment: equipmentDetails,
      totalPrice
    };
  }
} 