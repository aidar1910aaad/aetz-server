import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Material } from './entities/material.entity';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { MaterialHistoryFilterDto } from './dto/material-history-filter.dto';
import { MaterialHistory } from './entities/material-history.entity';
import { Category } from '../categories/entities/category.entity';
import { FindOptionsWhere, ILike, In, Between, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';

@Injectable()
export class MaterialsService {
  constructor(
    @InjectRepository(Material)
    private readonly materialRepo: Repository<Material>,

    @InjectRepository(MaterialHistory)
    private readonly historyRepo: Repository<MaterialHistory>,
  ) { }

  async create(dto: CreateMaterialDto): Promise<Material> {
    let category: Category | undefined;

    if (dto.categoryId) {
      const found = await this.materialRepo.manager.findOneBy(Category, { id: dto.categoryId });

      if (!found) {
        throw new NotFoundException(`Категория с ID ${dto.categoryId} не найдена`);
      }

      category = found;
    }

    const material = new Material();
    material.name = dto.name;
    material.unit = dto.unit;
    material.price = dto.price ?? 0;
    material.code = dto.code || String(Date.now());
    if (category) {
      material.category = category;
    }

    const saved = await this.materialRepo.save(material);
    console.log('✅ СОХРАНЕНО:', saved);
    return saved;
  }


  async findAll(query: {
    page?: number;
    limit?: number;
    search?: string;
    sort?: 'name' | 'price' | 'code';
    order?: 'ASC' | 'DESC';
    categoryId?: number;
  }): Promise<{ data: Material[]; total: number }> {
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

    return { data, total };
  }

  async findOne(id: number): Promise<Material> {
    const material = await this.materialRepo.findOne({
      where: { id },
      relations: ['category'],
    });

    if (!material) throw new NotFoundException('Материал не найден');
    return material;
  }

  async createMany(dtos: CreateMaterialDto[]): Promise<Material[]> {
    const results: Material[] = [];
    const batchSize = 100; // Размер пакета для вставки
    let currentBatch: Material[] = [];

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
      material.price = typeof dto.price === 'number' && !isNaN(dto.price) ? dto.price : 0;
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

    return results;
  }

  async update(id: number, dto: UpdateMaterialDto): Promise<Material> {
    const material = await this.findOne(id);

    const fieldsToCheck: (keyof UpdateMaterialDto)[] = ['name', 'unit', 'price'];

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

    return this.materialRepo.save(material);
  }

  async getHistory(id: number): Promise<MaterialHistory[]> {
    return this.historyRepo.find({
      where: { material: { id } }, // 👈 сравнение по ID
      relations: ['material'],     // если нужно подгрузить сам материал
      order: { changedAt: 'DESC' },
    });
  }

  async getHistoryWithFilters(filters: MaterialHistoryFilterDto): Promise<{
    data: MaterialHistory[];
    total: number;
    limit: number;
    offset: number;
  }> {
    const {
      materialName,
      materialCode,
      categoryId,
      fieldChanged,
      changedBy,
      dateFrom,
      dateTo,
      limit = 10,
      offset = 0,
    } = filters;

    // Строим условия для фильтрации
    const whereConditions: any = {};

    // Фильтр по материалу
    if (materialName || materialCode || categoryId) {
      whereConditions.material = {};
      
      if (materialName) {
        whereConditions.material.name = ILike(`%${materialName}%`);
      }
      
      if (materialCode) {
        whereConditions.material.code = ILike(`%${materialCode}%`);
      }
      
      if (categoryId) {
        whereConditions.material.category = { id: categoryId };
      }
    }

    // Фильтр по полю изменения
    if (fieldChanged) {
      whereConditions.fieldChanged = ILike(`%${fieldChanged}%`);
    }

    // Фильтр по пользователю
    if (changedBy) {
      whereConditions.changedBy = ILike(`%${changedBy}%`);
    }

    // Фильтр по дате
    if (dateFrom && dateTo) {
      whereConditions.changedAt = Between(new Date(dateFrom), new Date(dateTo));
    } else if (dateFrom) {
      whereConditions.changedAt = MoreThanOrEqual(new Date(dateFrom));
    } else if (dateTo) {
      whereConditions.changedAt = LessThanOrEqual(new Date(dateTo));
    }

    // Получаем данные с пагинацией
    const [data, total] = await this.historyRepo.findAndCount({
      where: whereConditions,
      relations: ['material', 'material.category'],
      order: { changedAt: 'DESC' },
      take: limit,
      skip: offset,
    });

    return {
      data,
      total,
      limit,
      offset,
    };
  }

  async delete(id: number): Promise<void> {
    const material = await this.materialRepo.findOne({ where: { id } });

    if (!material) {
      throw new NotFoundException(`Материал с ID ${id} не найден`);
    }

    await this.materialRepo.remove(material);
  }

}
