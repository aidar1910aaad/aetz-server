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
import { UpdateCalculationGroupDto } from './dto/update-calculation-group.dto';
import { CurrencySettingsService } from '../currency-settings/currency-settings.service';
import { AuditLogsService } from '../audit-logs/audit-logs.service';

@Injectable()
export class CalculationsService {
  constructor(
    @InjectRepository(CalculationGroup)
    private readonly groupRepo: Repository<CalculationGroup>,

    @InjectRepository(Calculation)
    private readonly calcRepo: Repository<Calculation>,

    @InjectRepository(Material)
    private readonly materialRepo: Repository<Material>, // 👈 обязательно
    private readonly currencySettingsService: CurrencySettingsService,
    private readonly auditLogsService: AuditLogsService,
  ) { }

  private toNumber(value: unknown): number {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : 0;
    }
    return 0;
  }

  private getRateByCurrency(settings: any, currency: string): number {
    switch ((currency || 'KZT').toUpperCase()) {
      case 'USD':
        return this.toNumber(settings.usdRate) || 1;
      case 'EUR':
        return this.toNumber(settings.eurRate) || 1;
      case 'RUB':
        return this.toNumber(settings.rubRate) || 1;
      case 'KZT':
      default:
        return this.toNumber(settings.kztRate) || 1;
    }
  }

  private getMaterialCurrentPriceKzt(material: Material, settings: any): number {
    const priceInCurrency = this.toNumber(material.priceInCurrency ?? material.price ?? 0);
    const rate = this.getRateByCurrency(settings, material.currency || 'KZT');

    if (!rate) return priceInCurrency;
    return Number((priceInCurrency * rate).toFixed(2));
  }

  // 🔄 Вспомогательная функция для обновления цен в cellConfig
  private updateCellConfigPrices(cellConfig: any, materialsMap: Map<number, number>) {
    if (!cellConfig || !cellConfig.materials) {
      return cellConfig;
    }

    const updatedMaterials = { ...cellConfig.materials };

    // Обновляем цены для одиночных материалов
    const singleMaterialTypes = ['switch', 'rza', 'counter', 'sr', 'tsn', 'tn'];
    singleMaterialTypes.forEach(type => {
      if (updatedMaterials[type] && updatedMaterials[type].id) {
        const freshPrice = materialsMap.get(updatedMaterials[type].id);
        if (freshPrice !== undefined) {
          updatedMaterials[type] = {
            ...updatedMaterials[type],
            price: freshPrice,
          };
        }
      }
    });

    // Обновляем цены для массивов материалов
    const arrayMaterialTypes = ['tt', 'pu', 'disconnector', 'busbar', 'busbridge'];
    arrayMaterialTypes.forEach(type => {
      if (Array.isArray(updatedMaterials[type])) {
        updatedMaterials[type] = updatedMaterials[type].map((material: any) => {
          if (material && material.id) {
            const freshPrice = materialsMap.get(material.id);
            if (freshPrice !== undefined) {
              return {
                ...material,
                price: freshPrice,
              };
            }
          }
          return material;
        });
      }
    });

    return {
      ...cellConfig,
      materials: updatedMaterials,
    };
  }

  // ✅ Создание группы
  async createGroup(dto: CreateCalculationGroupDto): Promise<CalculationGroup> {
    const group = this.groupRepo.create({
      name: dto.name,
      slug: slugify(dto.name, { lower: true, strict: true }),
      voltageType: dto.voltageType,
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
  async createCalculation(dto: CreateCalculationDto, changedBy?: string): Promise<Calculation> {
    const group = await this.groupRepo.findOne({ where: { id: dto.groupId } });
    if (!group) throw new NotFoundException('Группа не найдена');

    const calc = this.calcRepo.create({
      name: dto.name,
      slug: dto.slug,
      data: dto.data,
      group,
    });

    const saved = await this.calcRepo.save(calc);
    await this.auditLogsService.log({
      entityType: 'calculation',
      entityId: saved.id,
      action: 'CREATE',
      fieldChanged: 'entity',
      newValue: `Создана калькуляция "${saved.name}" (${saved.slug})`,
      changedBy: changedBy || 'Неизвестный пользователь',
    });
    return saved;
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
  async getCalculation(
    groupSlug: string,
    calcSlug: string,
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

    // 🔄 Загружаем актуальные цены
    const [freshMaterials, settings] = await Promise.all([
      this.materialRepo.find(),
      this.currencySettingsService.getSettings(),
    ]);
    const materialsMap = new Map(freshMaterials.map((m) => [m.id, this.getMaterialCurrentPriceKzt(m, settings)]));

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

    // 🔄 Обновляем цены в cellConfig
    if (calc.data.cellConfig) {
      calc.data.cellConfig = this.updateCellConfigPrices(calc.data.cellConfig, materialsMap);
    }

    return calc;
  }

  // ✅ Обновление калькуляции
  async updateCalculation(
    groupSlug: string,
    calcSlug: string,
    dto: UpdateCalculationDto,
    changedBy?: string,
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

    const previousState = {
      name: calc.name,
      slug: calc.slug,
      data: calc.data,
    };

    // Обновляем только те поля, которые были переданы
    if (dto.name) calc.name = dto.name;
    if (dto.slug) calc.slug = dto.slug;
    if (dto.data) calc.data = dto.data;

    // Сохраняем обновленную калькуляцию
    const updatedCalc = await this.calcRepo.save(calc);

    // Загружаем актуальные цены материалов
    const [freshMaterials, settings] = await Promise.all([
      this.materialRepo.find(),
      this.currencySettingsService.getSettings(),
    ]);
    const materialsMap = new Map(freshMaterials.map((m) => [m.id, this.getMaterialCurrentPriceKzt(m, settings)]));

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

    // 🔄 Обновляем цены в cellConfig
    if (updatedCalc.data && updatedCalc.data.cellConfig) {
      updatedCalc.data.cellConfig = this.updateCellConfigPrices(updatedCalc.data.cellConfig, materialsMap);
    }

    await this.auditLogsService.log({
      entityType: 'calculation',
      entityId: updatedCalc.id,
      action: 'UPDATE',
      oldValue: previousState,
      newValue: {
        name: updatedCalc.name,
        slug: updatedCalc.slug,
        data: updatedCalc.data,
      },
      changedBy: changedBy || 'Неизвестный пользователь',
    });

    return updatedCalc;
  }

  // Удаление калькуляции по groupSlug и calcSlug
  async deleteCalculation(groupSlug: string, calcSlug: string, changedBy?: string): Promise<void> {
    const group = await this.getGroupBySlug(groupSlug);
    const calc = await this.calcRepo.findOne({
      where: { slug: calcSlug, group: { id: group.id } },
    });
    if (!calc) throw new NotFoundException('Калькуляция не найдена');
    await this.auditLogsService.log({
      entityType: 'calculation',
      entityId: calc.id,
      action: 'DELETE',
      fieldChanged: 'entity',
      oldValue: `Удалена калькуляция "${calc.name}" (${calc.slug})`,
      changedBy: changedBy || 'Неизвестный пользователь',
    });
    await this.calcRepo.remove(calc);
  }

  // Удаление группы по ID
  async deleteGroupById(id: number): Promise<void> {
    console.log('=== УДАЛЕНИЕ ГРУППЫ ПО ID ===');
    console.log('Запрошенный ID:', id, 'тип:', typeof id);
    
    // Сначала проверим, есть ли группа с таким ID
    const allGroups = await this.groupRepo.find();
    console.log('Все группы в базе:', allGroups.map(g => `ID:${g.id}, slug:[${g.slug}]`));
    
    const group = await this.groupRepo.findOne({ 
      where: { id }, 
      relations: ['calculations'] 
    });
    
    console.log('Результат поиска по ID:', group ? `найдена - id=${group.id}, slug=[${group.slug}]` : 'НЕ НАЙДЕНА');
    
    if (!group) {
      console.log('❌ Группа не найдена, выбрасываем исключение');
      throw new NotFoundException('Группа не найдена');
    }
    
    console.log('✅ Группа найдена, начинаем удаление...');
    
    // Если есть связанные калькуляции — удаляем их вручную
    if (group.calculations && group.calculations.length > 0) {
      console.log(`Удаляю ${group.calculations.length} связанных калькуляций...`);
      await this.calcRepo.remove(group.calculations);
    }
    
    await this.groupRepo.remove(group);
    console.log('✅ Группа успешно удалена:', group.slug);
  }

  // Получить все калькуляции без фильтра по группе
  async getAllCalculations(): Promise<Calculation[]> {
    return this.calcRepo.find({ order: { name: 'ASC' } });
  }

  // ✅ Обновление группы
  async updateGroup(
    slug: string,
    dto: UpdateCalculationGroupDto,
  ): Promise<CalculationGroup> {
    console.log('=== СЕРВИС: ОБНОВЛЕНИЕ ГРУППЫ ===');
    console.log('Ищем группу по slug:', slug);
    
    // Проверим все группы в базе
    const allGroups = await this.groupRepo.find();
    console.log('Все группы в базе:', allGroups.map(g => `slug:[${g.slug}], id:${g.id}`));
    
    const group = await this.getGroupBySlug(slug);
    console.log('Найдена группа:', group ? `id=${group.id}, slug=[${group.slug}]` : 'НЕ НАЙДЕНА');
    
    // Обновляем только те поля, которые были переданы
    if (dto.name) {
      group.name = dto.name;
      // Автоматически генерируем новый slug при изменении названия
      group.slug = slugify(dto.name, { lower: true, strict: true });
      console.log('Название изменено, новый slug:', group.slug);
    }
    
    // Игнорируем dto.slug - slug генерируется автоматически
    if (dto.voltageType !== undefined) {
      group.voltageType = dto.voltageType;
    }
    
    console.log('Обновленные данные:', { 
      name: group.name, 
      slug: group.slug, 
      voltageType: group.voltageType 
    });
    
    return this.groupRepo.save(group);
  }
}
