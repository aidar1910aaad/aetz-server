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
const currency_settings_service_1 = require("../currency-settings/currency-settings.service");
const audit_logs_service_1 = require("../audit-logs/audit-logs.service");
let CalculationsService = class CalculationsService {
    constructor(groupRepo, calcRepo, materialRepo, currencySettingsService, auditLogsService) {
        this.groupRepo = groupRepo;
        this.calcRepo = calcRepo;
        this.materialRepo = materialRepo;
        this.currencySettingsService = currencySettingsService;
        this.auditLogsService = auditLogsService;
    }
    toNumber(value) {
        if (typeof value === 'number')
            return value;
        if (typeof value === 'string') {
            const parsed = Number(value);
            return Number.isFinite(parsed) ? parsed : 0;
        }
        return 0;
    }
    getRateByCurrency(settings, currency) {
        switch ((currency || 'KZT').toUpperCase()) {
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
    getMaterialCurrentPriceKzt(material, settings) {
        const priceInCurrency = this.toNumber(material.priceInCurrency ?? material.price ?? 0);
        const rate = this.getRateByCurrency(settings, material.currency || 'KZT');
        if (!rate)
            return priceInCurrency;
        return Number((priceInCurrency * rate).toFixed(2));
    }
    updateCellConfigPrices(cellConfig, materialsMap) {
        if (!cellConfig || !cellConfig.materials) {
            return cellConfig;
        }
        const updatedMaterials = { ...cellConfig.materials };
        const singleMaterialTypes = ['switch', 'rza', 'counter', 'sr', 'tsn', 'tn'];
        singleMaterialTypes.forEach((type) => {
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
        arrayMaterialTypes.forEach((type) => {
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
    applyCurrentCalculationSettings(calculation, settings) {
        const current = calculation || {};
        return {
            ...current,
            manufacturingHours: this.toNumber(current.manufacturingHours) || 4,
            hourlyRate: this.toNumber(settings.hourlyWage) || 2000,
            overheadPercentage: this.toNumber(settings.productionExpenses) || 10,
            adminPercentage: this.toNumber(settings.administrativeExpenses) || 15,
            plannedProfitPercentage: this.toNumber(settings.plannedSavings) || 10,
            ndsPercentage: this.toNumber(settings.vatRate) || 12,
        };
    }
    patchCalculationData(data, materialsMap, settings) {
        if (!data)
            return data;
        const patchedData = { ...data };
        if (Array.isArray(patchedData.categories)) {
            patchedData.categories = patchedData.categories.map((cat) => ({
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
        }
        if (patchedData.calculation) {
            patchedData.calculation = this.applyCurrentCalculationSettings(patchedData.calculation, settings);
        }
        if (patchedData.cellConfig) {
            patchedData.cellConfig = this.updateCellConfigPrices(patchedData.cellConfig, materialsMap);
        }
        return patchedData;
    }
    async buildMaterialsMapWithSettings() {
        const [freshMaterials, settings] = await Promise.all([
            this.materialRepo.find(),
            this.currencySettingsService.getSettings(),
        ]);
        return {
            settings,
            materialsMap: new Map(freshMaterials.map((m) => [m.id, this.getMaterialCurrentPriceKzt(m, settings)])),
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
    async createCalculation(dto, changedBy) {
        const group = await this.groupRepo.findOne({ where: { id: dto.groupId } });
        if (!group)
            throw new common_1.NotFoundException('Группа не найдена');
        const calc = this.calcRepo.create({
            name: dto.name,
            slug: dto.slug,
            data: dto.data,
            group,
        });
        const saved = await this.calcRepo.save(calc);
        await this.auditLogsService.log({
            entityType: 'calculation',
            entityId: saved.id,
            action: 'CREATE',
            fieldChanged: 'entity',
            newValue: `Создана калькуляция "${saved.name}" (${saved.slug})`,
            changedBy: changedBy || 'Неизвестный пользователь',
        });
        return saved;
    }
    async getCalculationsByGroupSlug(slug) {
        const group = await this.getGroupBySlug(slug);
        const calculations = await this.calcRepo.find({
            where: { group: { id: group.id } },
            order: { name: 'ASC' },
        });
        const { materialsMap, settings } = await this.buildMaterialsMapWithSettings();
        return calculations.map((calc) => ({
            ...calc,
            data: this.patchCalculationData(calc.data, materialsMap, settings),
        }));
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
        const { materialsMap, settings } = await this.buildMaterialsMapWithSettings();
        if (!calc.data || !Array.isArray(calc.data.categories)) {
            calc.data = { categories: [] };
            return calc;
        }
        calc.data = this.patchCalculationData(calc.data, materialsMap, settings);
        return calc;
    }
    async updateCalculation(groupSlug, calcSlug, dto, changedBy) {
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
        const previousState = {
            name: calc.name,
            slug: calc.slug,
            data: calc.data,
        };
        if (dto.name)
            calc.name = dto.name;
        if (dto.slug)
            calc.slug = dto.slug;
        if (dto.data)
            calc.data = dto.data;
        const updatedCalc = await this.calcRepo.save(calc);
        const { materialsMap, settings } = await this.buildMaterialsMapWithSettings();
        updatedCalc.data = this.patchCalculationData(updatedCalc.data, materialsMap, settings);
        await this.auditLogsService.log({
            entityType: 'calculation',
            entityId: updatedCalc.id,
            action: 'UPDATE',
            oldValue: previousState,
            newValue: {
                name: updatedCalc.name,
                slug: updatedCalc.slug,
                data: updatedCalc.data,
            },
            changedBy: changedBy || 'Неизвестный пользователь',
        });
        return updatedCalc;
    }
    async deleteCalculation(groupSlug, calcSlug, changedBy) {
        const group = await this.getGroupBySlug(groupSlug);
        const calc = await this.calcRepo.findOne({
            where: { slug: calcSlug, group: { id: group.id } },
        });
        if (!calc)
            throw new common_1.NotFoundException('Калькуляция не найдена');
        await this.auditLogsService.log({
            entityType: 'calculation',
            entityId: calc.id,
            action: 'DELETE',
            fieldChanged: 'entity',
            oldValue: `Удалена калькуляция "${calc.name}" (${calc.slug})`,
            changedBy: changedBy || 'Неизвестный пользователь',
        });
        await this.calcRepo.remove(calc);
    }
    async deleteGroupById(id) {
        console.log('=== УДАЛЕНИЕ ГРУППЫ ПО ID ===');
        console.log('Запрошенный ID:', id, 'тип:', typeof id);
        const allGroups = await this.groupRepo.find();
        console.log('Все группы в базе:', allGroups.map((g) => `ID:${g.id}, slug:[${g.slug}]`));
        const group = await this.groupRepo.findOne({
            where: { id },
            relations: ['calculations'],
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
        console.log('Все группы в базе:', allGroups.map((g) => `slug:[${g.slug}], id:${g.id}`));
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
            voltageType: group.voltageType,
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
        typeorm_2.Repository,
        currency_settings_service_1.CurrencySettingsService,
        audit_logs_service_1.AuditLogsService])
], CalculationsService);
//# sourceMappingURL=calculations.service.js.map