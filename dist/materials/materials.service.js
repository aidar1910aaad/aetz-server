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
const currency_settings_service_1 = require("../currency-settings/currency-settings.service");
let MaterialsService = class MaterialsService {
    constructor(materialRepo, historyRepo, currencySettingsService) {
        this.materialRepo = materialRepo;
        this.historyRepo = historyRepo;
        this.currencySettingsService = currencySettingsService;
    }
    toNumber(value) {
        if (typeof value === 'number') {
            return value;
        }
        if (typeof value === 'string') {
            const parsed = Number(value);
            return Number.isFinite(parsed) ? parsed : 0;
        }
        return 0;
    }
    getRateByCurrency(settings, currency) {
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
    convertToKzt(amount, currency, settings) {
        const rate = this.getRateByCurrency(settings, currency);
        if (!rate) {
            return amount;
        }
        return amount * rate;
    }
    async enrichMaterialWithCurrentPrice(material) {
        const settings = await this.currencySettingsService.getSettings();
        const currentPriceKzt = Number(this.convertToKzt(this.toNumber(material.priceInCurrency ?? material.price), material.currency || 'KZT', settings).toFixed(2));
        material.price = currentPriceKzt;
        return Object.assign(material, { currentPriceKzt });
    }
    async enrichMaterialsWithCurrentPrices(materials) {
        const settings = await this.currencySettingsService.getSettings();
        return materials.map((material) => {
            const currentPriceKzt = Number(this.convertToKzt(this.toNumber(material.priceInCurrency ?? material.price), material.currency || 'KZT', settings).toFixed(2));
            material.price = currentPriceKzt;
            return Object.assign(material, { currentPriceKzt });
        });
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
        const settings = await this.currencySettingsService.getSettings();
        const currency = (dto.currency || 'KZT').toUpperCase();
        const priceInCurrency = dto.priceInCurrency ?? dto.price ?? 0;
        const rateAtCreation = this.getRateByCurrency(settings, currency);
        const priceKztAtCreation = Number(this.convertToKzt(priceInCurrency, currency, settings).toFixed(2));
        const material = new material_entity_1.Material();
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
        const enrichedData = await this.enrichMaterialsWithCurrentPrices(data);
        return { data: enrichedData, total };
    }
    async findOne(id) {
        const material = await this.materialRepo.findOne({
            where: { id },
            relations: ['category'],
        });
        if (!material)
            throw new common_1.NotFoundException('Материал не найден');
        return this.enrichMaterialWithCurrentPrice(material);
    }
    async createMany(dtos) {
        const results = [];
        const batchSize = 100;
        let currentBatch = [];
        const settings = await this.currencySettingsService.getSettings();
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
        return this.enrichMaterialsWithCurrentPrices(results);
    }
    async update(id, dto) {
        const material = await this.findOne(id);
        const settings = await this.currencySettingsService.getSettings();
        const fieldsToCheck = ['name', 'unit'];
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
        }
        else if (dto.price !== undefined && String(dto.price) !== String(material.priceInCurrency)) {
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
        const saved = await this.materialRepo.save(material);
        return this.enrichMaterialWithCurrentPrice(saved);
    }
    async getHistory(id) {
        return this.historyRepo.find({
            where: { material: { id } },
            relations: ['material'],
            order: { changedAt: 'DESC' },
        });
    }
    async getRecentHistory(query) {
        const { page = 1, limit = 50, materialId, fieldChanged, changedBy, dateFrom, dateTo, search, } = query;
        const queryBuilder = this.historyRepo.createQueryBuilder('history')
            .leftJoinAndSelect('history.material', 'material')
            .leftJoinAndSelect('material.category', 'category')
            .orderBy('history.changedAt', 'DESC');
        if (materialId) {
            queryBuilder.andWhere('material.id = :materialId', { materialId });
        }
        if (fieldChanged) {
            queryBuilder.andWhere('history.fieldChanged = :fieldChanged', { fieldChanged });
        }
        if (changedBy) {
            queryBuilder.andWhere('LOWER(history.changedBy) LIKE LOWER(:changedBy)', {
                changedBy: `%${changedBy}%`
            });
        }
        if (dateFrom) {
            const fromDate = new Date(dateFrom);
            fromDate.setHours(0, 0, 0, 0);
            queryBuilder.andWhere('history.changedAt >= :dateFrom', {
                dateFrom: fromDate
            });
        }
        if (dateTo) {
            const dateToEnd = new Date(dateTo);
            dateToEnd.setHours(23, 59, 59, 999);
            queryBuilder.andWhere('history.changedAt <= :dateTo', { dateTo: dateToEnd });
        }
        if (search) {
            queryBuilder.andWhere('(LOWER(material.name) LIKE LOWER(:search) OR LOWER(material.code) LIKE LOWER(:search))', { search: `%${search}%` });
        }
        const skip = (page - 1) * limit;
        queryBuilder.skip(skip).take(limit);
        const [data, total] = await queryBuilder.getManyAndCount();
        return { data, total };
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
        typeorm_2.Repository,
        currency_settings_service_1.CurrencySettingsService])
], MaterialsService);
//# sourceMappingURL=materials.service.js.map