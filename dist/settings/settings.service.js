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
exports.SettingsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const setting_entity_1 = require("./entities/setting.entity");
const category_entity_1 = require("../categories/entities/category.entity");
const typeorm_3 = require("typeorm");
let SettingsService = class SettingsService {
    constructor(settingRepo, categoryRepo) {
        this.settingRepo = settingRepo;
        this.categoryRepo = categoryRepo;
        this.initializeSettings();
    }
    async initializeSettings() {
        const count = await this.settingRepo.count();
        if (count === 0) {
            const defaultSettings = new setting_entity_1.Setting();
            defaultSettings.settings = {
                rusn: [],
                bmz: [],
                runn: [],
                work: [],
                transformer: [],
                additionalEquipment: [],
                sr: [],
                tsn: [],
                tn: []
            };
            await this.settingRepo.save(defaultSettings);
        }
    }
    async create(dto) {
        const allCategoryIds = [
            ...(dto.settings.rusn || []).map(s => s.categoryId),
            ...(dto.settings.bmz || []).map(s => s.categoryId),
            ...(dto.settings.runn || []).map(s => s.categoryId),
            ...(dto.settings.work || []).map(s => s.categoryId),
            ...(dto.settings.transformer || []).map(s => s.categoryId),
            ...(dto.settings.additionalEquipment || []).map(s => s.categoryId),
            ...(dto.settings.sr || []).map(s => s.categoryId),
            ...(dto.settings.tsn || []).map(s => s.categoryId),
            ...(dto.settings.tn || []).map(s => s.categoryId)
        ];
        const uniqueCategoryIds = [...new Set(allCategoryIds)];
        if (uniqueCategoryIds.length > 0) {
            const categories = await this.categoryRepo.find({
                where: { id: (0, typeorm_3.In)(uniqueCategoryIds) }
            });
            if (categories.length !== uniqueCategoryIds.length) {
                const foundIds = categories.map(c => c.id);
                const missingIds = uniqueCategoryIds.filter(id => !foundIds.includes(id));
                throw new common_1.NotFoundException(`Категории с ID ${missingIds.join(', ')} не найдены`);
            }
        }
        const setting = await this.getSettings();
        setting.settings = dto.settings;
        return this.settingRepo.save(setting);
    }
    async getSettings() {
        const setting = await this.settingRepo.findOne({
            where: {},
            order: { createdAt: 'DESC' }
        });
        if (!setting) {
            throw new common_1.NotFoundException('Настройки не найдены');
        }
        return setting;
    }
    async update(dto) {
        const setting = await this.getSettings();
        const allCategoryIds = [
            ...(dto.settings.rusn || []).map(s => s.categoryId),
            ...(dto.settings.bmz || []).map(s => s.categoryId),
            ...(dto.settings.runn || []).map(s => s.categoryId),
            ...(dto.settings.work || []).map(s => s.categoryId),
            ...(dto.settings.transformer || []).map(s => s.categoryId),
            ...(dto.settings.additionalEquipment || []).map(s => s.categoryId),
            ...(dto.settings.sr || []).map(s => s.categoryId),
            ...(dto.settings.tsn || []).map(s => s.categoryId),
            ...(dto.settings.tn || []).map(s => s.categoryId)
        ];
        const uniqueCategoryIds = [...new Set(allCategoryIds)];
        if (uniqueCategoryIds.length > 0) {
            const categories = await this.categoryRepo.find({
                where: { id: (0, typeorm_3.In)(uniqueCategoryIds) }
            });
            if (categories.length !== uniqueCategoryIds.length) {
                const foundIds = categories.map(c => c.id);
                const missingIds = uniqueCategoryIds.filter(id => !foundIds.includes(id));
                throw new common_1.NotFoundException(`Категории с ID ${missingIds.join(', ')} не найдены`);
            }
        }
        const updatedSettings = { ...setting.settings };
        if (dto.settings.rusn)
            updatedSettings.rusn = dto.settings.rusn;
        if (dto.settings.bmz)
            updatedSettings.bmz = dto.settings.bmz;
        if (dto.settings.runn)
            updatedSettings.runn = dto.settings.runn;
        if (dto.settings.work)
            updatedSettings.work = dto.settings.work;
        if (dto.settings.transformer)
            updatedSettings.transformer = dto.settings.transformer;
        if (dto.settings.additionalEquipment)
            updatedSettings.additionalEquipment = dto.settings.additionalEquipment;
        if (dto.settings.sr)
            updatedSettings.sr = dto.settings.sr;
        if (dto.settings.tsn)
            updatedSettings.tsn = dto.settings.tsn;
        if (dto.settings.tn)
            updatedSettings.tn = dto.settings.tn;
        setting.settings = updatedSettings;
        return this.settingRepo.save(setting);
    }
    async reset() {
        const setting = await this.getSettings();
        setting.settings = {
            rusn: [],
            bmz: [],
            runn: [],
            work: [],
            transformer: [],
            additionalEquipment: [],
            sr: [],
            tsn: [],
            tn: []
        };
        return this.settingRepo.save(setting);
    }
};
exports.SettingsService = SettingsService;
exports.SettingsService = SettingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(setting_entity_1.Setting)),
    __param(1, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], SettingsService);
//# sourceMappingURL=settings.service.js.map