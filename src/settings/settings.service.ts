import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Setting } from './entities/setting.entity';
import { CreateSettingDto } from './dto/create-setting.dto';
import { Category } from '../categories/entities/category.entity';
import { In } from 'typeorm';

@Injectable()
export class SettingsService {
    constructor(
        @InjectRepository(Setting)
        private readonly settingRepo: Repository<Setting>,
        @InjectRepository(Category)
        private readonly categoryRepo: Repository<Category>,
    ) {
        this.initializeSettings();
    }

    private async initializeSettings() {
        const count = await this.settingRepo.count();
        if (count === 0) {
            const defaultSettings = new Setting();
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

    async create(dto: CreateSettingDto): Promise<Setting> {
        // Проверяем существование всех категорий
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
                where: { id: In(uniqueCategoryIds) }
            });

            if (categories.length !== uniqueCategoryIds.length) {
                const foundIds = categories.map(c => c.id);
                const missingIds = uniqueCategoryIds.filter(id => !foundIds.includes(id));
                throw new NotFoundException(`Категории с ID ${missingIds.join(', ')} не найдены`);
            }
        }

        const setting = await this.getSettings();
        setting.settings = dto.settings;
        return this.settingRepo.save(setting);
    }

    async getSettings(): Promise<Setting> {
        const setting = await this.settingRepo.findOne({
            where: {},
            order: { createdAt: 'DESC' }
        });

        if (!setting) {
            throw new NotFoundException('Настройки не найдены');
        }

        return setting;
    }

    async update(dto: CreateSettingDto): Promise<Setting> {
        const setting = await this.getSettings();

        // Проверяем существование всех категорий из обновляемых полей
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
                where: { id: In(uniqueCategoryIds) }
            });

            if (categories.length !== uniqueCategoryIds.length) {
                const foundIds = categories.map(c => c.id);
                const missingIds = uniqueCategoryIds.filter(id => !foundIds.includes(id));
                throw new NotFoundException(`Категории с ID ${missingIds.join(', ')} не найдены`);
            }
        }

        // Обновляем только те поля, которые были отправлены в запросе
        const updatedSettings = { ...setting.settings };

        if (dto.settings.rusn) updatedSettings.rusn = dto.settings.rusn;
        if (dto.settings.bmz) updatedSettings.bmz = dto.settings.bmz;
        if (dto.settings.runn) updatedSettings.runn = dto.settings.runn;
        if (dto.settings.work) updatedSettings.work = dto.settings.work;
        if (dto.settings.transformer) updatedSettings.transformer = dto.settings.transformer;
        if (dto.settings.additionalEquipment) updatedSettings.additionalEquipment = dto.settings.additionalEquipment;
        if (dto.settings.sr) updatedSettings.sr = dto.settings.sr;
        if (dto.settings.tsn) updatedSettings.tsn = dto.settings.tsn;
        if (dto.settings.tn) updatedSettings.tn = dto.settings.tn;

        setting.settings = updatedSettings;
        return this.settingRepo.save(setting);
    }

    async reset(): Promise<Setting> {
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
} 