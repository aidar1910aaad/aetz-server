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
exports.CalculationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const slugify_1 = require("slugify");
const material_entity_1 = require("../materials/entities/material.entity");
const calculation_group_entity_1 = require("./entities/calculation-group.entity");
const calculation_entity_1 = require("./entities/calculation.entity");
let CalculationsService = class CalculationsService {
    constructor(groupRepo, calcRepo, materialRepo) {
        this.groupRepo = groupRepo;
        this.calcRepo = calcRepo;
        this.materialRepo = materialRepo;
    }
    updateCellConfigPrices(cellConfig, materialsMap) {
        if (!cellConfig || !cellConfig.materials) {
            return cellConfig;
        }
        const updatedMaterials = { ...cellConfig.materials };
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
        const arrayMaterialTypes = ['tt', 'pu', 'disconnector', 'busbar', 'busbridge'];
        arrayMaterialTypes.forEach(type => {
            if (Array.isArray(updatedMaterials[type])) {
                updatedMaterials[type] = updatedMaterials[type].map((material) => {
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
    async createGroup(dto) {
        const group = this.groupRepo.create({
            name: dto.name,
            slug: (0, slugify_1.default)(dto.name, { lower: true, strict: true }),
            voltageType: dto.voltageType,
        });
        return this.groupRepo.save(group);
    }
    async getAllGroups() {
        return this.groupRepo.find();
    }
    async getGroupBySlug(slug) {
        const group = await this.groupRepo.findOne({ where: { slug } });
        if (!group)
            throw new common_1.NotFoundException('Группа не найдена');
        return group;
    }
    async createCalculation(dto) {
        const group = await this.groupRepo.findOne({ where: { id: dto.groupId } });
        if (!group)
            throw new common_1.NotFoundException('Группа не найдена');
        const calc = this.calcRepo.create({
            name: dto.name,
            slug: dto.slug,
            data: dto.data,
            group,
        });
        return this.calcRepo.save(calc);
    }
    async getCalculationsByGroupSlug(slug) {
        const group = await this.getGroupBySlug(slug);
        return this.calcRepo.find({
            where: { group: { id: group.id } },
            order: { name: 'ASC' },
        });
    }
    async getCalculation(groupSlug, calcSlug) {
        const group = await this.getGroupBySlug(groupSlug);
        const calc = await this.calcRepo.findOne({
            where: {
                slug: calcSlug,
                group: { id: group.id },
            },
            relations: ['group'],
        });
        if (!calc)
            throw new common_1.NotFoundException('Калькуляция не найдена');
        const freshMaterials = await this.materialRepo.find();
        const materialsMap = new Map(freshMaterials.map((m) => [m.id, m.price]));
        if (!calc.data || !Array.isArray(calc.data.categories)) {
            calc.data = { categories: [] };
            return calc;
        }
        const updatedCategories = calc.data.categories.map((cat) => ({
            ...cat,
            items: Array.isArray(cat.items)
                ? cat.items.map((item) => {
                    if (!item.id)
                        return item;
                    const freshPrice = materialsMap.get(item.id);
                    return {
                        ...item,
                        price: freshPrice ?? item.price,
                    };
                })
                : [],
        }));
        calc.data.categories = updatedCategories;
        if (calc.data.cellConfig) {
            calc.data.cellConfig = this.updateCellConfigPrices(calc.data.cellConfig, materialsMap);
        }
        return calc;
    }
    async updateCalculation(groupSlug, calcSlug, dto) {
        const group = await this.getGroupBySlug(groupSlug);
        const calc = await this.calcRepo.findOne({
            where: {
                slug: calcSlug,
                group: { id: group.id },
            },
            relations: ['group'],
        });
        if (!calc)
            throw new common_1.NotFoundException('Калькуляция не найдена');
        if (dto.name)
            calc.name = dto.name;
        if (dto.slug)
            calc.slug = dto.slug;
        if (dto.data)
            calc.data = dto.data;
        const updatedCalc = await this.calcRepo.save(calc);
        const freshMaterials = await this.materialRepo.find();
        const materialsMap = new Map(freshMaterials.map((m) => [m.id, m.price]));
        if (updatedCalc.data && Array.isArray(updatedCalc.data.categories)) {
            const updatedCategories = updatedCalc.data.categories.map((cat) => ({
                ...cat,
                items: Array.isArray(cat.items)
                    ? cat.items.map((item) => {
                        if (!item.id)
                            return item;
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
        if (updatedCalc.data && updatedCalc.data.cellConfig) {
            updatedCalc.data.cellConfig = this.updateCellConfigPrices(updatedCalc.data.cellConfig, materialsMap);
        }
        return updatedCalc;
    }
    async deleteCalculation(groupSlug, calcSlug) {
        const group = await this.getGroupBySlug(groupSlug);
        const calc = await this.calcRepo.findOne({
            where: { slug: calcSlug, group: { id: group.id } },
        });
        if (!calc)
            throw new common_1.NotFoundException('Калькуляция не найдена');
        await this.calcRepo.remove(calc);
    }
    async deleteGroupById(id) {
        console.log('=== УДАЛЕНИЕ ГРУППЫ ПО ID ===');
        console.log('Запрошенный ID:', id, 'тип:', typeof id);
        const allGroups = await this.groupRepo.find();
        console.log('Все группы в базе:', allGroups.map(g => `ID:${g.id}, slug:[${g.slug}]`));
        const group = await this.groupRepo.findOne({
            where: { id },
            relations: ['calculations']
        });
        console.log('Результат поиска по ID:', group ? `найдена - id=${group.id}, slug=[${group.slug}]` : 'НЕ НАЙДЕНА');
        if (!group) {
            console.log('❌ Группа не найдена, выбрасываем исключение');
            throw new common_1.NotFoundException('Группа не найдена');
        }
        console.log('✅ Группа найдена, начинаем удаление...');
        if (group.calculations && group.calculations.length > 0) {
            console.log(`Удаляю ${group.calculations.length} связанных калькуляций...`);
            await this.calcRepo.remove(group.calculations);
        }
        await this.groupRepo.remove(group);
        console.log('✅ Группа успешно удалена:', group.slug);
    }
    async getAllCalculations() {
        return this.calcRepo.find({ order: { name: 'ASC' } });
    }
    async updateGroup(slug, dto) {
        console.log('=== СЕРВИС: ОБНОВЛЕНИЕ ГРУППЫ ===');
        console.log('Ищем группу по slug:', slug);
        const allGroups = await this.groupRepo.find();
        console.log('Все группы в базе:', allGroups.map(g => `slug:[${g.slug}], id:${g.id}`));
        const group = await this.getGroupBySlug(slug);
        console.log('Найдена группа:', group ? `id=${group.id}, slug=[${group.slug}]` : 'НЕ НАЙДЕНА');
        if (dto.name) {
            group.name = dto.name;
            group.slug = (0, slugify_1.default)(dto.name, { lower: true, strict: true });
            console.log('Название изменено, новый slug:', group.slug);
        }
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
};
exports.CalculationsService = CalculationsService;
exports.CalculationsService = CalculationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(calculation_group_entity_1.CalculationGroup)),
    __param(1, (0, typeorm_1.InjectRepository)(calculation_entity_1.Calculation)),
    __param(2, (0, typeorm_1.InjectRepository)(material_entity_1.Material)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], CalculationsService);
//# sourceMappingURL=calculations.service.js.map