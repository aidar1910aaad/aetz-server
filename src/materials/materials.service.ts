import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { Material } from './entities/material.entity';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { MaterialHistory } from './entities/material-history.entity';
import { Category } from '../categories/entities/category.entity';
import { CurrencySettingsService } from '../currency-settings/currency-settings.service';
import { Calculation } from '../calculations/entities/calculation.entity';
import { AuditLogsService } from '../audit-logs/audit-logs.service';

@Injectable()
export class MaterialsService {
  constructor(
    @InjectRepository(Material)
    private readonly materialRepo: Repository<Material>,

    @InjectRepository(MaterialHistory)
    private readonly historyRepo: Repository<MaterialHistory>,
    @InjectRepository(Calculation)
    private readonly calculationRepo: Repository<Calculation>,
    private readonly currencySettingsService: CurrencySettingsService,
    private readonly auditLogsService: AuditLogsService,
  ) { }

  private async logAudit(entry: {
    entityId?: string | number;
    action: string;
    fieldChanged?: string;
    oldValue?: unknown;
    newValue?: unknown;
    changedBy?: string;
  }): Promise<void> {
    await this.auditLogsService.log({
      entityType: 'material',
      entityId: entry.entityId,
      action: entry.action,
      fieldChanged: entry.fieldChanged,
      oldValue: entry.oldValue,
      newValue: entry.newValue,
      changedBy: entry.changedBy,
    });
  }

  private toNumber(value: unknown): number {
    if (typeof value === 'number') {
      return value;
    }

    if (typeof value === 'string') {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : 0;
    }

    return 0;
  }

  private getRateByCurrency(settings: any, currency: string): number {
    const normalized = (currency || 'KZT').toUpperCase();

    switch (normalized) {
      case 'USD':
        return this.toNumber(settings.usdRate) || 1;
      case 'EUR':
        return this.toNumber(settings.eurRate) || 1;
      case 'RUB':
        return this.toNumber(settings.rubRate) || 1;
      case 'CNY':
        return this.toNumber(settings.cnyRate) || 1;
      case 'KZT':
      default:
        return this.toNumber(settings.kztRate) || 1;
    }
  }

  private convertToKzt(amount: number, currency: string, settings: any): number {
    const rate = this.getRateByCurrency(settings, currency);

    if (!rate) {
      return amount;
    }

    return amount * rate;
  }

  private async enrichMaterialWithCurrentPrice(material: Material): Promise<Material & { currentPriceKzt: number }> {
    const settings = await this.currencySettingsService.getSettings();
    const currentPriceKzt = Number(
      this.convertToKzt(
        this.toNumber(material.priceInCurrency ?? material.price),
        material.currency || 'KZT',
        settings,
      ).toFixed(2),
    );

    material.price = currentPriceKzt;

    return Object.assign(material, { currentPriceKzt });
  }

  private async enrichMaterialsWithCurrentPrices(materials: Material[]): Promise<Array<Material & { currentPriceKzt: number }>> {
    const settings = await this.currencySettingsService.getSettings();

    return materials.map((material) => {
      const currentPriceKzt = Number(
        this.convertToKzt(
          this.toNumber(material.priceInCurrency ?? material.price),
          material.currency || 'KZT',
          settings,
        ).toFixed(2),
      );

      material.price = currentPriceKzt;
      return Object.assign(material, { currentPriceKzt });
    });
  }

  private updateCalculationDataPriceByMaterialId(data: any, materialId: number, newPrice: number): any {
    if (!data || typeof data !== 'object') {
      return data;
    }

    const nextData = { ...data };

    if (Array.isArray(nextData.categories)) {
      nextData.categories = nextData.categories.map((category) => {
        if (!Array.isArray(category?.items)) {
          return category;
        }

        return {
          ...category,
          items: category.items.map((item) => {
            if (item?.id === materialId) {
              return { ...item, price: newPrice };
            }
            return item;
          }),
        };
      });
    }

    if (nextData.cellConfig?.materials && typeof nextData.cellConfig.materials === 'object') {
      const materials = { ...nextData.cellConfig.materials };
      Object.keys(materials).forEach((key) => {
        const value = materials[key];
        if (Array.isArray(value)) {
          materials[key] = value.map((item) => (item?.id === materialId ? { ...item, price: newPrice } : item));
          return;
        }

        if (value?.id === materialId) {
          materials[key] = { ...value, price: newPrice };
        }
      });

      nextData.cellConfig = {
        ...nextData.cellConfig,
        materials,
      };
    }

    return nextData;
  }

  private async syncMaterialPriceInCalculations(materialId: number, priceKzt: number): Promise<void> {
    const calculations = await this.calculationRepo.find();
    if (!calculations.length) {
      return;
    }

    const updates: Calculation[] = [];
    for (const calc of calculations) {
      const updatedData = this.updateCalculationDataPriceByMaterialId(calc.data, materialId, priceKzt);
      if (JSON.stringify(updatedData) !== JSON.stringify(calc.data)) {
        calc.data = updatedData;
        updates.push(calc);
      }
    }

    if (updates.length > 0) {
      await this.calculationRepo.save(updates);
    }
  }

  async create(dto: CreateMaterialDto, changedBy?: string): Promise<Material & { currentPriceKzt: number }> {
    let category: Category | undefined;

    if (dto.categoryId) {
      const found = await this.materialRepo.manager.findOneBy(Category, { id: dto.categoryId });

      if (!found) {
        throw new NotFoundException(`Категория с ID ${dto.categoryId} не найдена`);
      }

      category = found;
    }

    const settings = await this.currencySettingsService.getSettings();
    const currency = (dto.currency || 'KZT').toUpperCase();
    const priceInCurrency = dto.priceInCurrency ?? dto.price ?? 0;
    const rateAtCreation = this.getRateByCurrency(settings, currency);
    const priceKztAtCreation = Number(this.convertToKzt(priceInCurrency, currency, settings).toFixed(2));

    const material = new Material();
    material.name = dto.name;
    material.unit = dto.unit;
    material.currency = currency;
    material.priceInCurrency = priceInCurrency;
    material.rateAtCreation = rateAtCreation;
    material.priceKztAtCreation = priceKztAtCreation;
    material.price = priceKztAtCreation;
    material.code = dto.code || String(Date.now());
    if (category) {
      material.category = category;
    }

    const saved = await this.materialRepo.save(material);
    console.log('✅ СОХРАНЕНО:', saved);
    await this.logAudit({
      entityId: saved.id,
      action: 'CREATE',
      fieldChanged: 'entity',
      newValue: `Создан материал "${saved.name}" (${saved.code || 'без кода'})`,
      changedBy: changedBy || 'Неизвестный пользователь',
    });
    return this.enrichMaterialWithCurrentPrice(saved);
  }


  async findAll(query: {
    page?: number;
    limit?: number;
    search?: string;
    sort?: 'name' | 'price' | 'code';
    order?: 'ASC' | 'DESC';
    categoryId?: number;
  }): Promise<{ data: Array<Material & { currentPriceKzt: number }>; total: number }> {
    const {
      page = 1,
      limit = 50,
      search,
      sort = 'name',
      order = 'ASC',
      categoryId,
    } = query;

    const queryBuilder = this.materialRepo
      .createQueryBuilder('material')
      .leftJoinAndSelect('material.category', 'category')
      .orderBy(`material.${sort}`, order)
      .skip((page - 1) * limit)
      .take(limit);

    if (search?.trim()) {
      // Токенизируем поиск и нормализуем строку материала, чтобы запросы вида
      // "кабель 240" находили "Кабель ... 4 * 240", "кабель-240", "кабель   240" и т.п.
      const normalizedTerms = search
        .toLowerCase()
        .trim()
        .split(/\s+/)
        .map((term) => term.trim())
        .filter(Boolean);

      const normalizedMaterialExpr = `
        LOWER(
          regexp_replace(
            CONCAT_WS(' ', COALESCE(material.name, ''), COALESCE(material.code, '')),
            '[^0-9A-Za-zА-Яа-яЁё]+',
            ' ',
            'g'
          )
        )
      `;

      normalizedTerms.forEach((term, index) => {
        queryBuilder.andWhere(`${normalizedMaterialExpr} LIKE :searchTerm${index}`, {
          [`searchTerm${index}`]: `%${term}%`,
        });
      });
    }

    if (categoryId) {
      queryBuilder.andWhere('category.id = :categoryId', { categoryId });
    }

    const [data, total] = await queryBuilder.getManyAndCount();

    const enrichedData = await this.enrichMaterialsWithCurrentPrices(data);

    return { data: enrichedData, total };
  }

  async findOne(id: number): Promise<Material & { currentPriceKzt: number }> {
    const material = await this.materialRepo.findOne({
      where: { id },
      relations: ['category'],
    });

    if (!material) throw new NotFoundException('Материал не найден');
    return this.enrichMaterialWithCurrentPrice(material);
  }

  async createMany(dtos: CreateMaterialDto[], changedBy?: string): Promise<Array<Material & { currentPriceKzt: number }>> {
    const results: Material[] = [];
    const batchSize = 100; // Размер пакета для вставки
    let currentBatch: Material[] = [];
    const settings = await this.currencySettingsService.getSettings();

    for (const dto of dtos) {
      let category: Category | undefined;
      if (dto.categoryId) {
        const found = await this.materialRepo.manager.findOneBy(Category, { id: dto.categoryId });
        if (found) {
          category = found;
        }
      }

      const material = new Material();
      material.name = dto.name || 'Без названия';
      material.unit = dto.unit || 'шт';
      const currency = (dto.currency || 'KZT').toUpperCase();
      const priceInCurrency = typeof dto.priceInCurrency === 'number'
        ? dto.priceInCurrency
        : typeof dto.price === 'number' && !isNaN(dto.price)
          ? dto.price
          : 0;
      const rateAtCreation = this.getRateByCurrency(settings, currency);
      const priceKztAtCreation = Number(this.convertToKzt(priceInCurrency, currency, settings).toFixed(2));

      material.currency = currency;
      material.priceInCurrency = priceInCurrency;
      material.rateAtCreation = rateAtCreation;
      material.priceKztAtCreation = priceKztAtCreation;
      material.price = priceKztAtCreation;
      material.code = dto.code ? String(dto.code) : String(Date.now());
      if (category) {
        material.category = category;
      }

      currentBatch.push(material);

      // Когда накопили достаточно материалов, сохраняем пакет
      if (currentBatch.length >= batchSize) {
        const savedBatch = await this.materialRepo.save(currentBatch);
        results.push(...savedBatch);
        console.log(`✅ Сохранен пакет из ${savedBatch.length} материалов`);
        currentBatch = [];
      }
    }

    // Сохраняем оставшиеся материалы
    if (currentBatch.length > 0) {
      const savedBatch = await this.materialRepo.save(currentBatch);
      results.push(...savedBatch);
      console.log(`✅ Сохранен последний пакет из ${savedBatch.length} материалов`);
    }

    for (const saved of results) {
      await this.logAudit({
        entityId: saved.id,
        action: 'CREATE',
        fieldChanged: 'entity',
        newValue: `Создан материал "${saved.name}" (${saved.code || 'без кода'})`,
        changedBy: changedBy || 'Неизвестный пользователь',
      });
    }

    return this.enrichMaterialsWithCurrentPrices(results);
  }

  async update(id: number, dto: UpdateMaterialDto, changedBy?: string): Promise<Material & { currentPriceKzt: number }> {
    const material = await this.findOne(id);
    const settings = await this.currencySettingsService.getSettings();

    const fieldsToCheck: (keyof UpdateMaterialDto)[] = ['name', 'unit'];

    for (const field of fieldsToCheck) {
      if (
        dto[field] !== undefined &&
        String(dto[field]) !== String(material[field])
      ) {
        await this.historyRepo.save({
          material,
          fieldChanged: field,
          oldValue: String(material[field]),
          newValue: String(dto[field]),
          changedBy: changedBy || dto.changedBy || 'Неизвестный пользователь',
        });
        await this.logAudit({
          entityId: material.id,
          action: 'UPDATE',
          fieldChanged: String(field),
          oldValue: material[field],
          newValue: dto[field],
          changedBy: changedBy || dto.changedBy || 'Неизвестный пользователь',
        });
        material[field] = dto[field];
      }
    }

    if (dto.currency !== undefined && dto.currency.toUpperCase() !== material.currency) {
      await this.historyRepo.save({
        material,
        fieldChanged: 'currency',
        oldValue: material.currency,
        newValue: dto.currency.toUpperCase(),
        changedBy: changedBy || dto.changedBy || 'Неизвестный пользователь',
      });
      await this.logAudit({
        entityId: material.id,
        action: 'UPDATE',
        fieldChanged: 'currency',
        oldValue: material.currency,
        newValue: dto.currency.toUpperCase(),
        changedBy: changedBy || dto.changedBy || 'Неизвестный пользователь',
      });
      material.currency = dto.currency.toUpperCase();
    }

    if (dto.priceInCurrency !== undefined && String(dto.priceInCurrency) !== String(material.priceInCurrency)) {
      await this.historyRepo.save({
        material,
        fieldChanged: 'priceInCurrency',
        oldValue: String(material.priceInCurrency),
        newValue: String(dto.priceInCurrency),
        changedBy: changedBy || dto.changedBy || 'Неизвестный пользователь',
      });
      await this.logAudit({
        entityId: material.id,
        action: 'UPDATE',
        fieldChanged: 'priceInCurrency',
        oldValue: material.priceInCurrency,
        newValue: dto.priceInCurrency,
        changedBy: changedBy || dto.changedBy || 'Неизвестный пользователь',
      });
      material.priceInCurrency = dto.priceInCurrency;
    } else if (dto.price !== undefined && String(dto.price) !== String(material.priceInCurrency)) {
      await this.historyRepo.save({
        material,
        fieldChanged: 'priceInCurrency',
        oldValue: String(material.priceInCurrency),
        newValue: String(dto.price),
        changedBy: changedBy || dto.changedBy || 'Неизвестный пользователь',
      });
      await this.logAudit({
        entityId: material.id,
        action: 'UPDATE',
        fieldChanged: 'priceInCurrency',
        oldValue: material.priceInCurrency,
        newValue: dto.price,
        changedBy: changedBy || dto.changedBy || 'Неизвестный пользователь',
      });
      material.priceInCurrency = dto.price;
    }

    material.price = Number(this.convertToKzt(material.priceInCurrency, material.currency, settings).toFixed(2));

    // Обновление категории
    if (dto.categoryId) {
      const newCategory = await this.materialRepo.manager.findOneBy(Category, {
        id: dto.categoryId,
      });

      if (!newCategory) {
        throw new NotFoundException(`Категория с ID ${dto.categoryId} не найдена`);
      }

      if (newCategory.id !== material.category?.id) {
        await this.historyRepo.save({
          material,
          fieldChanged: 'category',
          oldValue: material.category?.name ?? 'не указана',
          newValue: newCategory.name,
          changedBy: changedBy || dto.changedBy || 'Неизвестный пользователь',
        });
        await this.logAudit({
          entityId: material.id,
          action: 'UPDATE',
          fieldChanged: 'category',
          oldValue: material.category?.name ?? null,
          newValue: newCategory.name,
          changedBy: changedBy || dto.changedBy || 'Неизвестный пользователь',
        });

        material.category = newCategory;
      }
    }

    const saved = await this.materialRepo.save(material);
    await this.syncMaterialPriceInCalculations(saved.id, this.toNumber(saved.price));
    return this.enrichMaterialWithCurrentPrice(saved);
  }

  async getHistory(id: number): Promise<MaterialHistory[]> {
    return this.historyRepo.find({
      where: { material: { id } }, // 👈 сравнение по ID
      relations: ['material'],     // если нужно подгрузить сам материал
      order: { changedAt: 'DESC' },
    });
  }

  async getRecentHistory(query: {
    page?: number;
    limit?: number;
    materialId?: number;
    fieldChanged?: string;
    changedBy?: string;
    dateFrom?: string;
    dateTo?: string;
    search?: string;
  }): Promise<{ data: MaterialHistory[]; total: number }> {
    const {
      page = 1,
      limit = 50,
      materialId,
      fieldChanged,
      changedBy,
      dateFrom,
      dateTo,
      search,
    } = query;

    const queryBuilder = this.historyRepo.createQueryBuilder('history')
      .leftJoinAndSelect('history.material', 'material')
      .leftJoinAndSelect('material.category', 'category')
      .orderBy('history.changedAt', 'DESC');

    // Фильтр по ID материала
    if (materialId) {
      queryBuilder.andWhere('material.id = :materialId', { materialId });
    }

    // Фильтр по измененному полю
    if (fieldChanged) {
      queryBuilder.andWhere('history.fieldChanged = :fieldChanged', { fieldChanged });
    }

    // Фильтр по пользователю (регистронезависимый поиск)
    if (changedBy) {
      queryBuilder.andWhere('LOWER(history.changedBy) LIKE LOWER(:changedBy)', { 
        changedBy: `%${changedBy}%` 
      });
    }

    // Фильтр по дате начала
    if (dateFrom) {
      const fromDate = new Date(dateFrom);
      fromDate.setHours(0, 0, 0, 0); // Устанавливаем начало дня
      queryBuilder.andWhere('history.changedAt >= :dateFrom', { 
        dateFrom: fromDate
      });
    }

    // Фильтр по дате конца
    if (dateTo) {
      const dateToEnd = new Date(dateTo);
      dateToEnd.setHours(23, 59, 59, 999); // Устанавливаем конец дня
      queryBuilder.andWhere('history.changedAt <= :dateTo', { dateTo: dateToEnd });
    }

    // Поиск по названию материала или коду (регистронезависимый)
    if (search) {
      queryBuilder.andWhere(
        '(LOWER(material.name) LIKE LOWER(:search) OR LOWER(material.code) LIKE LOWER(:search))',
        { search: `%${search}%` }
      );
    }

    // Пагинация
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return { data, total };
  }

  async delete(id: number, changedBy?: string): Promise<void> {
    const material = await this.materialRepo.findOne({ where: { id } });

    if (!material) {
      throw new NotFoundException(`Материал с ID ${id} не найден`);
    }

    await this.logAudit({
      entityId: material.id,
      action: 'DELETE',
      fieldChanged: 'entity',
      oldValue: `Удален материал "${material.name}" (${material.code || 'без кода'})`,
      changedBy: changedBy || 'Неизвестный пользователь',
    });
    await this.materialRepo.remove(material);
  }

}
