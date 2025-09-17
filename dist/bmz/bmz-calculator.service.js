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
exports.BmzCalculatorService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bmz_area_price_entity_1 = require("./entities/bmz-area-price.entity");
const bmz_wall_thickness_entity_1 = require("./entities/bmz-wall-thickness.entity");
const bmz_equipment_entity_1 = require("./entities/bmz-equipment.entity");
let BmzCalculatorService = class BmzCalculatorService {
    constructor(areaPriceRepository, wallThicknessRepository, equipmentRepository) {
        this.areaPriceRepository = areaPriceRepository;
        this.wallThicknessRepository = wallThicknessRepository;
        this.equipmentRepository = equipmentRepository;
    }
    async calculatePrice(params) {
        const areaPrice = await this.areaPriceRepository.findOne({
            where: {
                isActive: true,
                minArea: (0, typeorm_2.LessThanOrEqual)(params.area),
                maxArea: (0, typeorm_2.MoreThanOrEqual)(params.area)
            }
        });
        if (!areaPrice) {
            throw new common_1.NotFoundException('Не найдена цена для указанной площади');
        }
        const wallThickness = await this.wallThicknessRepository.findOne({
            where: {
                isActive: true,
                minThickness: (0, typeorm_2.LessThanOrEqual)(params.wallThickness),
                maxThickness: (0, typeorm_2.MoreThanOrEqual)(params.wallThickness)
            }
        });
        if (!wallThickness) {
            throw new common_1.NotFoundException('Не найдена цена для указанной толщины стен');
        }
        const equipment = await this.equipmentRepository.find({
            where: {
                id: (0, typeorm_2.In)(params.selectedEquipment),
                isActive: true
            }
        });
        if (equipment.length !== params.selectedEquipment.length) {
            throw new common_1.NotFoundException('Не все выбранное оборудование найдено');
        }
        const basePrice = areaPrice.basePricePerSquareMeter * params.area;
        const wallThicknessPrice = wallThickness.pricePerSquareMeter * params.area;
        const equipmentDetails = equipment.map(eq => {
            let price = 0;
            let description = '';
            switch (eq.priceType) {
                case 'perSquareMeter':
                    price = eq.pricePerSquareMeter * params.area;
                    description = `${params.area} м² × ${eq.pricePerSquareMeter} ₽/м²`;
                    break;
                case 'perHalfSquareMeter':
                    price = eq.pricePerSquareMeter * (params.area / 2);
                    description = `(${params.area} м² / 2) × ${eq.pricePerSquareMeter} ₽/м²`;
                    break;
                case 'fixed':
                    price = eq.fixedPrice;
                    description = `Фиксированная цена: ${eq.fixedPrice} ₽`;
                    break;
            }
            return {
                name: eq.name,
                price,
                description
            };
        });
        const totalPrice = basePrice + wallThicknessPrice + equipmentDetails.reduce((sum, eq) => sum + eq.price, 0);
        return {
            basePrice,
            wallThicknessPrice,
            equipment: equipmentDetails,
            totalPrice
        };
    }
};
exports.BmzCalculatorService = BmzCalculatorService;
exports.BmzCalculatorService = BmzCalculatorService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(bmz_area_price_entity_1.BmzAreaPrice)),
    __param(1, (0, typeorm_1.InjectRepository)(bmz_wall_thickness_entity_1.BmzWallThickness)),
    __param(2, (0, typeorm_1.InjectRepository)(bmz_equipment_entity_1.BmzEquipment)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], BmzCalculatorService);
//# sourceMappingURL=bmz-calculator.service.js.map