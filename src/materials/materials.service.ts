import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Material } from './entities/material.entity';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { MaterialHistory } from './entities/material-history.entity';
import { Category } from '../categories/entities/category.entity';

@Injectable()
export class MaterialsService {
  constructor(
    @InjectRepository(Material)
    private readonly materialRepo: Repository<Material>,

    @InjectRepository(MaterialHistory)
    private readonly historyRepo: Repository<MaterialHistory>,
  ) {}

  async create(dto: CreateMaterialDto): Promise<Material> {
    let category: Category | undefined;

if (dto.categoryId) {
  const found = await this.materialRepo.manager.findOneBy(Category, { id: dto.categoryId });

  if (!found) {
    throw new NotFoundException(`Категория с ID ${dto.categoryId} не найдена`);
  }

  category = found;
}
  
const material = this.materialRepo.create({
  name: dto.name,
  unit: dto.unit,
  price: dto.price ?? 0, // если undefined, ставим 0
  code: dto.code,
  category: category ?? undefined,
});


  
    const saved = await this.materialRepo.save(material);
  
    console.log('✅ СОХРАНЕНО:', saved);
  
    return saved;
  }
  

  async findAll(): Promise<Material[]> {
    return this.materialRepo.find({ relations: ['category'] });
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
  
    for (const dto of dtos) {
      const material = this.materialRepo.create();
  
      if (dto.name) material.name = dto.name;
      if (dto.unit) material.unit = dto.unit;
      if (dto.price) material.price = dto.price;
  
      if (dto.categoryId) {
        const category = await this.materialRepo.manager.findOneBy(Category, {
          id: dto.categoryId,
        });
        if (category) material.category = category;
      }
  
      const saved = await this.materialRepo.save(material);
      results.push(saved);
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

  async delete(id: number): Promise<void> {
    const material = await this.materialRepo.findOne({ where: { id } });
  
    if (!material) {
      throw new NotFoundException(`Материал с ID ${id} не найден`);
    }
  
    await this.materialRepo.remove(material);
  }
  
}
