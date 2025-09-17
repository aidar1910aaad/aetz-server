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
exports.BmzSettingsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bmz_settings_entity_1 = require("./entities/bmz-settings.entity");
const bmz_area_price_entity_1 = require("./entities/bmz-area-price.entity");
const bmz_equipment_entity_1 = require("./entities/bmz-equipment.entity");
const bmz_wall_thickness_entity_1 = require("./entities/bmz-wall-thickness.entity");
let BmzSettingsService = class BmzSettingsService {
    constructor(settingsRepository, areaPriceRepository, equipmentRepository, wallThicknessRepository) {
        this.settingsRepository = settingsRepository;
        this.areaPriceRepository = areaPriceRepository;
        this.equipmentRepository = equipmentRepository;
        this.wallThicknessRepository = wallThicknessRepository;
        this.initializeSettings();
    }
    async initializeSettings() {
        const settings = await this.settingsRepository.find();
        if (settings.length === 0) {
            const defaultSettings = new bmz_settings_entity_1.BmzSettings();
            defaultSettings.basePricePerSquareMeter = 2000;
            defaultSettings.areaPriceRanges = [];
            defaultSettings.equipment = [];
            defaultSettings.isActive = true;
            await this.settingsRepository.save(defaultSettings);
        }
    }
    async getSettings() {
        const settings = await this.settingsRepository.find();
        if (settings.length === 0) {
            throw new common_1.NotFoundException('Настройки БМЗ не найдены');
        }
        return settings[0];
    }
    async updateSettings(updateSettingsDto) {
        const settings = await this.getSettings();
        for (const range of updateSettingsDto.areaPriceRanges) {
            if (range.minArea > range.maxArea) {
                throw new Error('Минимальная площадь не может быть больше максимальной');
            }
            if (range.minWallThickness > range.maxWallThickness) {
                throw new Error('Минимальная толщина стен не может быть больше максимальной');
            }
        }
        for (const equipment of updateSettingsDto.equipment) {
            if (equipment.priceType === 'fixed' && !equipment.fixedPrice) {
                throw new Error('Для фиксированной цены необходимо указать fixedPrice');
            }
            if ((equipment.priceType === 'perSquareMeter' || equipment.priceType === 'perHalfSquareMeter') &&
                !equipment.pricePerSquareMeter) {
                throw new Error('Для цены за квадратный метр необходимо указать pricePerSquareMeter');
            }
        }
        Object.assign(settings, updateSettingsDto);
        return this.settingsRepository.save(settings);
    }
    async getAllSettings() {
        const [areaPrices, equipment, wallThicknesses] = await Promise.all([
            this.areaPriceRepository.find({
                where: { isActive: true },
                order: { minArea: 'ASC' }
            }),
            this.equipmentRepository.find({
                where: { isActive: true },
                order: { name: 'ASC' }
            }),
            this.wallThicknessRepository.find({
                where: { isActive: true },
                order: { minThickness: 'ASC' }
            })
        ]);
        return {
            areaPrices,
            equipment,
            wallThicknesses
        };
    }
    async createAreaPrice(data) {
        const areaPrice = new bmz_area_price_entity_1.BmzAreaPrice();
        Object.assign(areaPrice, {
            ...data,
            isActive: true
        });
        return this.areaPriceRepository.save(areaPrice);
    }
    async deleteAreaPrice(id) {
        const areaPrice = await this.areaPriceRepository.findOne({ where: { id } });
        if (!areaPrice) {
            throw new common_1.NotFoundException('Диапазон цен не найден');
        }
        areaPrice.isActive = false;
        return this.areaPriceRepository.save(areaPrice);
    }
    async createEquipment(data) {
        if (data.priceType === bmz_equipment_entity_1.EquipmentPriceType.FIXED && !data.fixedPrice) {
            throw new Error('Для фиксированной цены необходимо указать fixedPrice');
        }
        if ((data.priceType === bmz_equipment_entity_1.EquipmentPriceType.PER_SQUARE_METER ||
            data.priceType === bmz_equipment_entity_1.EquipmentPriceType.PER_HALF_SQUARE_METER) &&
            !data.pricePerSquareMeter) {
            throw new Error('Для цены за квадратный метр необходимо указать pricePerSquareMeter');
        }
        const equipment = new bmz_equipment_entity_1.BmzEquipment();
        Object.assign(equipment, {
            ...data,
            isActive: true
        });
        return this.equipmentRepository.save(equipment);
    }
    async deleteEquipment(id) {
        const equipment = await this.equipmentRepository.findOne({ where: { id } });
        if (!equipment) {
            throw new common_1.NotFoundException('Оборудование не найдено');
        }
        equipment.isActive = false;
        return this.equipmentRepository.save(equipment);
    }
    async createWallThickness(data) {
        if (data.minThickness > data.maxThickness) {
            throw new Error('Минимальная толщина не может быть больше максимальной');
        }
        const wallThickness = new bmz_wall_thickness_entity_1.BmzWallThickness();
        wallThickness.minThickness = data.minThickness;
        wallThickness.maxThickness = data.maxThickness;
        wallThickness.pricePerSquareMeter = data.pricePerSquareMeter;
        wallThickness.isActive = true;
        return this.wallThicknessRepository.save(wallThickness);
    }
    async deleteWallThickness(id) {
        const wallThickness = await this.wallThicknessRepository.findOne({ where: { id } });
        if (!wallThickness) {
            throw new common_1.NotFoundException('Диапазон цен по толщине стен не найден');
        }
        wallThickness.isActive = false;
        await this.wallThicknessRepository.save(wallThickness);
    }
};
exports.BmzSettingsService = BmzSettingsService;
exports.BmzSettingsService = BmzSettingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(bmz_settings_entity_1.BmzSettings)),
    __param(1, (0, typeorm_1.InjectRepository)(bmz_area_price_entity_1.BmzAreaPrice)),
    __param(2, (0, typeorm_1.InjectRepository)(bmz_equipment_entity_1.BmzEquipment)),
    __param(3, (0, typeorm_1.InjectRepository)(bmz_wall_thickness_entity_1.BmzWallThickness)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], BmzSettingsService);
//# sourceMappingURL=bmz-settings.service.js.map