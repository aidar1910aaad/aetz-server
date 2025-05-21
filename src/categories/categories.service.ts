import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Material } from '../materials/entities/material.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
    @InjectRepository(Material)
    private readonly materialRepo: Repository<Material>,
  ) { }

  async create(dto: CreateCategoryDto) {
    // Проверяем, что ID указан
    if (!dto.id) {
      throw new Error('ID категории должен быть указан');
    }

    // Проверяем не существует ли уже категория с таким ID
    const existingCategory = await this.categoryRepo.findOne({ where: { id: dto.id } });
    if (existingCategory) {
      throw new ConflictException(`Категория с ID ${dto.id} уже существует`);
    }

    const category = this.categoryRepo.create(dto);
    return this.categoryRepo.save(category);
  }

  async createMany(dtos: CreateCategoryDto[]) {
    const results: Category[] = [];

    for (const dto of dtos) {
      // Проверяем, что ID указан
      if (!dto.id) {
        throw new Error('ID категории должен быть указан');
      }

      // Проверяем не существует ли уже категория с таким ID
      const existingCategory = await this.categoryRepo.findOne({ where: { id: dto.id } });
      if (existingCategory) {
        throw new ConflictException(`Категория с ID ${dto.id} уже существует`);
      }

      const category = this.categoryRepo.create(dto);
      const saved = await this.categoryRepo.save(category);
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
    Object.assign(category, dto);
    return this.categoryRepo.save(category);
  }

  async remove(id: number) {
    const category = await this.findOne(id);
    return this.categoryRepo.remove(category);
  }

  async removeMany(ids: number[]) {
    // Сначала удаляем все связанные материалы
    await this.materialRepo
      .createQueryBuilder()
      .delete()
      .from(Material)
      .where("categoryId IN (:...ids)", { ids })
      .execute();

    // Затем удаляем сами категории
    const result = await this.categoryRepo
      .createQueryBuilder()
      .delete()
      .from(Category)
      .where("id IN (:...ids)", { ids })
      .execute();

    return result;
  }
}
