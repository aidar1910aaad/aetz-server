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
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const category_entity_1 = require("./entities/category.entity");
const material_entity_1 = require("../materials/entities/material.entity");
let CategoriesService = class CategoriesService {
    constructor(categoryRepo, materialRepo) {
        this.categoryRepo = categoryRepo;
        this.materialRepo = materialRepo;
    }
    async create(dto) {
        if (!dto.id) {
            throw new Error('ID категории должен быть указан');
        }
        const existingCategory = await this.categoryRepo.findOne({ where: { id: dto.id } });
        if (existingCategory) {
            throw new common_1.ConflictException(`Категория с ID ${dto.id} уже существует`);
        }
        const category = this.categoryRepo.create(dto);
        return this.categoryRepo.save(category);
    }
    async createMany(dtos) {
        const results = [];
        for (const dto of dtos) {
            if (!dto.id) {
                throw new Error('ID категории должен быть указан');
            }
            const existingCategory = await this.categoryRepo.findOne({ where: { id: dto.id } });
            if (existingCategory) {
                throw new common_1.ConflictException(`Категория с ID ${dto.id} уже существует`);
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
    async findOne(id) {
        const category = await this.categoryRepo.findOne({ where: { id } });
        if (!category)
            throw new common_1.NotFoundException('Категория не найдена');
        return category;
    }
    async findMaterialsByCategoryId(categoryId) {
        const category = await this.categoryRepo.findOne({
            where: { id: categoryId },
            relations: ['materials'],
        });
        if (!category) {
            throw new common_1.NotFoundException(`Категория с ID ${categoryId} не найдена`);
        }
        return category.materials;
    }
    async update(id, dto) {
        const category = await this.findOne(id);
        Object.assign(category, dto);
        return this.categoryRepo.save(category);
    }
    async remove(id) {
        const category = await this.findOne(id);
        return this.categoryRepo.remove(category);
    }
    async removeMany(ids) {
        await this.materialRepo
            .createQueryBuilder()
            .delete()
            .from(material_entity_1.Material)
            .where("categoryId IN (:...ids)", { ids })
            .execute();
        const result = await this.categoryRepo
            .createQueryBuilder()
            .delete()
            .from(category_entity_1.Category)
            .where("id IN (:...ids)", { ids })
            .execute();
        return result;
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __param(1, (0, typeorm_1.InjectRepository)(material_entity_1.Material)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map