import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Material } from '../materials/entities/material.entity';
import { Setting, EquipmentSettings } from '../settings/entities/setting.entity';

const SETTINGS_KEYS: (keyof EquipmentSettings)[] = [
  'rusn',
  'bmz',
  'runn',
  'work',
  'transformer',
  'additionalEquipment',
  'sr',
  'tsn',
  'tn',
];

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
    @InjectRepository(Material)
    private readonly materialRepo: Repository<Material>,
    @InjectRepository(Setting)
    private readonly settingRepo: Repository<Setting>
  ) {}

  private async generateFourDigitCategoryId(): Promise<number> {
    const existing = await this.categoryRepo.find({ select: ['id'] });
    const usedIds = new Set(existing.map((category) => category.id));

    for (let id = 1000; id <= 9999; id++) {
      if (!usedIds.has(id)) {
        return id;
      }
    }

    throw new ConflictException('Нет свободных 4-значных ID для категории');
  }

  private async assertCategoryIdAvailable(id: number, excludeId?: number): Promise<void> {
    if (excludeId !== undefined && id === excludeId) {
      return;
    }

    const existingCategory = await this.categoryRepo.findOne({ where: { id } });
    if (existingCategory) {
      throw new ConflictException(`Категория с ID ${id} уже существует`);
    }
  }

  private async assertCategoryNameAvailable(name: string, excludeId?: number): Promise<void> {
    const existingCategory = await this.categoryRepo.findOne({ where: { name } });
    if (existingCategory && existingCategory.id !== excludeId) {
      throw new ConflictException(`Категория с названием «${name}» уже существует`);
    }
  }

  private async assertCategoryCodeAvailable(
    code: string | null | undefined,
    excludeId?: number
  ): Promise<void> {
    if (!code) {
      return;
    }

    const existingCategory = await this.categoryRepo.findOne({ where: { code } });
    if (existingCategory && existingCategory.id !== excludeId) {
      throw new ConflictException(`Категория с кодом «${code}» уже существует`);
    }
  }

  private buildMigratingName(id: number): string {
    return `__migrating_${id}_${Date.now()}__`;
  }

  private buildMigratingCode(id: number): string {
    return `__m_${id}_${Date.now()}__`;
  }

  private remapCategoryIdInSettings(
    settings: EquipmentSettings,
    oldId: number,
    newId: number
  ): EquipmentSettings {
    const nextSettings = { ...settings };

    for (const key of SETTINGS_KEYS) {
      if (!Array.isArray(nextSettings[key])) {
        continue;
      }

      nextSettings[key] = nextSettings[key].map((item) =>
        item.categoryId === oldId ? { ...item, categoryId: newId } : item
      );
    }

    return nextSettings;
  }

  async create(dto: CreateCategoryDto) {
    const categoryId = dto.id ?? (await this.generateFourDigitCategoryId());
    await this.assertCategoryIdAvailable(categoryId);
    await this.assertCategoryNameAvailable(dto.name);
    await this.assertCategoryCodeAvailable(dto.code);

    const category = this.categoryRepo.create({
      ...dto,
      id: categoryId,
    });

    return this.categoryRepo.save(category);
  }

  async createMany(dtos: CreateCategoryDto[]) {
    const results: Category[] = [];

    for (const dto of dtos) {
      const saved = await this.create(dto);
      results.push(saved);
    }

    return results;
  }

  findAll() {
    return this.categoryRepo.find();
  }

  async findOne(id: number) {
    const category = await this.categoryRepo.findOne({ where: { id } });
    if (!category) throw new NotFoundException('Категория не найдена');
    return category;
  }

  async findMaterialsByCategoryId(categoryId: number): Promise<Material[]> {
    const category = await this.categoryRepo.findOne({
      where: { id: categoryId },
      relations: ['materials'],
    });

    if (!category) {
      throw new NotFoundException(`Категория с ID ${categoryId} не найдена`);
    }

    return category.materials;
  }

  async update(id: number, dto: UpdateCategoryDto) {
    const category = await this.findOne(id);
    const nextId = dto.id;
    const nextName = dto.name ?? category.name;
    const nextCode = dto.code !== undefined ? dto.code : category.code;
    const nextDescription = dto.description !== undefined ? dto.description : category.description;

    if (nextId !== undefined && nextId !== id) {
      await this.assertCategoryIdAvailable(nextId, id);
      await this.assertCategoryNameAvailable(nextName, id);
      await this.assertCategoryCodeAvailable(nextCode, id);

      await this.categoryRepo.manager.transaction(async (manager) => {
        // Освобождаем уникальные поля у старой записи, иначе INSERT новой строки
        // с тем же name/code упадёт до удаления старой категории.
        await manager.update(
          Category,
          { id },
          {
            name: this.buildMigratingName(id),
            ...(category.code ? { code: this.buildMigratingCode(id) } : {}),
          }
        );

        const nextCategory = manager.create(Category, {
          id: nextId,
          name: nextName,
          code: nextCode,
          description: nextDescription,
        });
        await manager.save(Category, nextCategory);

        await manager
          .createQueryBuilder()
          .update(Material)
          .set({ category: { id: nextId } as Category })
          .where('categoryId = :oldId', { oldId: id })
          .execute();

        const setting = await manager.findOne(Setting, { where: { id: 'settings' } });
        if (setting) {
          setting.settings = this.remapCategoryIdInSettings(setting.settings, id, nextId);
          await manager.save(setting);
        }

        await manager.delete(Category, { id });
      });

      return this.findOne(nextId);
    }

    if (dto.name !== undefined) {
      await this.assertCategoryNameAvailable(dto.name, id);
      category.name = dto.name;
    }
    if (dto.code !== undefined) {
      await this.assertCategoryCodeAvailable(dto.code, id);
      category.code = dto.code;
    }
    if (dto.description !== undefined) {
      category.description = dto.description;
    }

    return this.categoryRepo.save(category);
  }

  async remove(id: number) {
    const category = await this.findOne(id);
    return this.categoryRepo.remove(category);
  }

  async removeMany(ids: number[]) {
    await this.materialRepo
      .createQueryBuilder()
      .delete()
      .from(Material)
      .where('categoryId IN (:...ids)', { ids })
      .execute();

    const result = await this.categoryRepo
      .createQueryBuilder()
      .delete()
      .from(Category)
      .where('id IN (:...ids)', { ids })
      .execute();

    return result;
  }
}
