"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaterialsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const material_entity_1 = require("./entities/material.entity");
const material_history_entity_1 = require("./entities/material-history.entity");
const category_entity_1 = require("../categories/entities/category.entity");
const typeorm_3 = require("typeorm");
let MaterialsService = class MaterialsService {
    constructor(materialRepo, historyRepo) {
        this.materialRepo = materialRepo;
        this.historyRepo = historyRepo;
    }
    async create(dto) {
        let category;
        if (dto.categoryId) {
            const found = await this.materialRepo.manager.findOneBy(category_entity_1.Category, { id: dto.categoryId });
            if (!found) {
                throw new common_1.NotFoundException(`Категория с ID ${dto.categoryId} не найдена`);
            }
            category = found;
        }
        const material = new material_entity_1.Material();
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
    async findAll(query) {
        const { page = 1, limit = 50, search, sort = 'name', order = 'ASC', categoryId, } = query;
        const where = [];
        if (search) {
            where.push({ name: (0, typeorm_3.ILike)(`%${search}%`) });
            where.push({ code: (0, typeorm_3.ILike)(`%${search}%`) });
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
    async findOne(id) {
        const material = await this.materialRepo.findOne({
            where: { id },
            relations: ['category'],
        });
        if (!material)
            throw new common_1.NotFoundException('Материал не найден');
        return material;
    }
    async createMany(dtos) {
        const results = [];
        const batchSize = 100;
        let currentBatch = [];
        for (const dto of dtos) {
            let category;
            if (dto.categoryId) {
                const found = await this.materialRepo.manager.findOneBy(category_entity_1.Category, { id: dto.categoryId });
                if (found) {
                    category = found;
                }
            }
            const material = new material_entity_1.Material();
            material.name = dto.name || 'Без названия';
            material.unit = dto.unit || 'шт';
            material.price = typeof dto.price === 'number' && !isNaN(dto.price) ? dto.price : 0;
            material.code = dto.code ? String(dto.code) : String(Date.now());
            if (category) {
                material.category = category;
            }
            currentBatch.push(material);
            if (currentBatch.length >= batchSize) {
                const savedBatch = await this.materialRepo.save(currentBatch);
                results.push(...savedBatch);
                console.log(`✅ Сохранен пакет из ${savedBatch.length} материалов`);
                currentBatch = [];
            }
        }
        if (currentBatch.length > 0) {
            const savedBatch = await this.materialRepo.save(currentBatch);
            results.push(...savedBatch);
            console.log(`✅ Сохранен последний пакет из ${savedBatch.length} материалов`);
        }
        return results;
    }
    async update(id, dto) {
        const material = await this.findOne(id);
        const fieldsToCheck = ['name', 'unit', 'price'];
        for (const field of fieldsToCheck) {
            if (dto[field] !== undefined &&
                String(dto[field]) !== String(material[field])) {
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
        if (dto.categoryId) {
            const newCategory = await this.materialRepo.manager.findOneBy(category_entity_1.Category, {
                id: dto.categoryId,
            });
            if (!newCategory) {
                throw new common_1.NotFoundException(`Категория с ID ${dto.categoryId} не найдена`);
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
    async getHistory(id) {
        return this.historyRepo.find({
            where: { material: { id } },
            relations: ['material'],
            order: { changedAt: 'DESC' },
        });
    }
    async getRecentHistory() {
        return this.historyRepo.find({
            relations: ['material', 'material.category'],
            order: { changedAt: 'DESC' },
            take: 10,
        });
    }
    async delete(id) {
        const material = await this.materialRepo.findOne({ where: { id } });
        if (!material) {
            throw new common_1.NotFoundException(`Материал с ID ${id} не найден`);
        }
        await this.materialRepo.remove(material);
    }
};
exports.MaterialsService = MaterialsService;
exports.MaterialsService = MaterialsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(material_entity_1.Material)),
    __param(1, (0, typeorm_1.InjectRepository)(material_history_entity_1.MaterialHistory)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], MaterialsService);
//# sourceMappingURL=materials.service.js.map