import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Material } from './entities/material.entity';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { MaterialHistory } from './entities/material-history.entity';
import { Category } from '../categories/entities/category.entity';
import { FindOptionsWhere, ILike } from 'typeorm';
import { CurrencySettingsService } from '../currency-settings/currency-settings.service';

@Injectable()
export class MaterialsService {
  constructor(
    @InjectRepository(Material)
    private readonly materialRepo: Repository<Material>,

    @InjectRepository(MaterialHistory)
    private readonly historyRepo: Repository<MaterialHistory>,
    private readonly currencySettingsService: CurrencySettingsService,
  ) { }

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
      case 'KZT':
      default:
        return this.toNumber(settings.kztRate) || 1;
    }
  }

  private convertToKzt(amount: number, currency: string, settings: any): number {
    const fromRate = this.getRateByCurrency(settings, currency);
    const kztRate = this.getRateByCurrency(settings, 'KZT');

    if (!fromRate || !kztRate) {
      return amount;
    }

    return (amount / fromRate) * kztRate;
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

  async create(dto: CreateMaterialDto): Promise<Material & { currentPriceKzt: number }> {
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

    const where: FindOptionsWhere<Material>[] = [];

    if (search) {
      where.push({ name: ILike(`%${search}%`) });
      where.push({ code: ILike(`%${search}%`) });
    }

    if (categoryId) {
      where.push({ category: { id: categoryId } });
    }

    const [data, total] = await this.materialRepo.findAndCount({
      where: where.length > 0 ? where : undefined,
      relations: ['category'],
      order: { [sort]: order },
      take: limit,
      skip: (page - 1) * limit,
    });

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

  async createMany(dtos: CreateMaterialDto[]): Promise<Array<Material & { currentPriceKzt: number }>> {
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

    return this.enrichMaterialsWithCurrentPrices(results);
  }

  async update(id: number, dto: UpdateMaterialDto): Promise<Material & { currentPriceKzt: number }> {
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
          changedBy: dto.changedBy || 'Неизвестный пользователь',
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
        changedBy: dto.changedBy || 'Неизвестный пользователь',
      });
      material.currency = dto.currency.toUpperCase();
    }

    if (dto.priceInCurrency !== undefined && String(dto.priceInCurrency) !== String(material.priceInCurrency)) {
      await this.historyRepo.save({
        material,
        fieldChanged: 'priceInCurrency',
        oldValue: String(material.priceInCurrency),
        newValue: String(dto.priceInCurrency),
        changedBy: dto.changedBy || 'Неизвестный пользователь',
      });
      material.priceInCurrency = dto.priceInCurrency;
    } else if (dto.price !== undefined && String(dto.price) !== String(material.priceInCurrency)) {
      await this.historyRepo.save({
        material,
        fieldChanged: 'priceInCurrency',
        oldValue: String(material.priceInCurrency),
        newValue: String(dto.price),
        changedBy: dto.changedBy || 'Неизвестный пользователь',
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
          changedBy: dto.changedBy || 'Неизвестный пользователь',
        });

        material.category = newCategory;
      }
    }

    const saved = await this.materialRepo.save(material);
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

  async delete(id: number): Promise<void> {
    const material = await this.materialRepo.findOne({ where: { id } });

    if (!material) {
      throw new NotFoundException(`Материал с ID ${id} не найден`);
    }

    await this.materialRepo.remove(material);
  }

}
