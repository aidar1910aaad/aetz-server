import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import slugify from 'slugify';

import { Material } from '../materials/entities/material.entity';
import { CalculationGroup } from './entities/calculation-group.entity';
import { Calculation } from './entities/calculation.entity';
import { CreateCalculationDto } from './dto/create-calculation.dto';
import { CreateCalculationGroupDto } from './dto/create-calculation-group.dto';
import { UpdateCalculationDto } from './dto/update-calculation.dto';

@Injectable()
export class CalculationsService {
  constructor(
    @InjectRepository(CalculationGroup)
    private readonly groupRepo: Repository<CalculationGroup>,

    @InjectRepository(Calculation)
    private readonly calcRepo: Repository<Calculation>,

    @InjectRepository(Material)
    private readonly materialRepo: Repository<Material>, // 👈 обязательно
  ) { }

  // ✅ Создание группы
  async createGroup(dto: CreateCalculationGroupDto): Promise<CalculationGroup> {
    const group = this.groupRepo.create({
      name: dto.name,
      slug: dto.slug || slugify(dto.name, { lower: true, strict: true }),
    });

    return this.groupRepo.save(group);
  }

  // ✅ Получение всех групп
  async getAllGroups(): Promise<CalculationGroup[]> {
    return this.groupRepo.find();
  }

  // ✅ Поиск группы по slug
  async getGroupBySlug(slug: string): Promise<CalculationGroup> {
    const group = await this.groupRepo.findOne({ where: { slug } });
    if (!group) throw new NotFoundException('Группа не найдена');
    return group;
  }

  // ✅ Создание калькуляции
  async createCalculation(dto: CreateCalculationDto): Promise<Calculation> {
    const group = await this.groupRepo.findOne({ where: { id: dto.groupId } });
    if (!group) throw new NotFoundException('Группа не найдена');

    const calc = this.calcRepo.create({
      name: dto.name,
      slug: dto.slug,
      data: dto.data,
      group,
    });

    return this.calcRepo.save(calc);
  }

  // ✅ Получить все калькуляции группы
  async getCalculationsByGroupSlug(slug: string): Promise<Calculation[]> {
    const group = await this.getGroupBySlug(slug);
    return this.calcRepo.find({
      where: { group: { id: group.id } },
      order: { name: 'ASC' },
    });
  }

  // ✅ Получить одну калькуляцию и обновить цены на лету
  async getCalculation(groupSlug: string, calcSlug: string): Promise<Calculation> {
    const group = await this.getGroupBySlug(groupSlug);

    const calc = await this.calcRepo.findOne({
      where: {
        slug: calcSlug,
        group: { id: group.id },
      },
      relations: ['group'],
    });

    if (!calc) throw new NotFoundException('Калькуляция не найдена');

    // 🔄 Загружаем актуальные цены
    const freshMaterials = await this.materialRepo.find();
    const materialsMap = new Map(freshMaterials.map((m) => [m.id, m.price]));

    // 🛡 Защита от отсутствия data или categories
    if (!calc.data || !Array.isArray(calc.data.categories)) {
      calc.data = { categories: [] };
      return calc;
    }

    // 🔁 Обновляем цены
    const updatedCategories = calc.data.categories.map((cat) => ({
      ...cat,
      items: Array.isArray(cat.items)
        ? cat.items.map((item) => {
          if (!item.id) return item; // ручной материал
          const freshPrice = materialsMap.get(item.id);
          return {
            ...item,
            price: freshPrice ?? item.price,
          };
        })
        : [],
    }));

    calc.data.categories = updatedCategories;

    return calc;
  }

  // ✅ Обновление калькуляции
  async updateCalculation(
    groupSlug: string,
    calcSlug: string,
    dto: UpdateCalculationDto,
  ): Promise<Calculation> {
    const group = await this.getGroupBySlug(groupSlug);

    const calc = await this.calcRepo.findOne({
      where: {
        slug: calcSlug,
        group: { id: group.id },
      },
      relations: ['group'],
    });

    if (!calc) throw new NotFoundException('Калькуляция не найдена');

    // Обновляем только те поля, которые были переданы
    if (dto.name) calc.name = dto.name;
    if (dto.slug) calc.slug = dto.slug;
    if (dto.data) calc.data = dto.data;

    // Сохраняем обновленную калькуляцию
    const updatedCalc = await this.calcRepo.save(calc);

    // Загружаем актуальные цены материалов
    const freshMaterials = await this.materialRepo.find();
    const materialsMap = new Map(freshMaterials.map((m) => [m.id, m.price]));

    // Обновляем цены в данных калькуляции
    if (updatedCalc.data && Array.isArray(updatedCalc.data.categories)) {
      const updatedCategories = updatedCalc.data.categories.map((cat) => ({
        ...cat,
        items: Array.isArray(cat.items)
          ? cat.items.map((item) => {
            if (!item.id) return item;
            const freshPrice = materialsMap.get(item.id);
            return {
              ...item,
              price: freshPrice ?? item.price,
            };
          })
          : [],
      }));

      updatedCalc.data.categories = updatedCategories;
    }

    return updatedCalc;
  }
}
