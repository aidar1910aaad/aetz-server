"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BmzModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const bmz_settings_controller_1 = require("./bmz-settings.controller");
const bmz_settings_service_1 = require("./bmz-settings.service");
const bmz_calculator_controller_1 = require("./bmz-calculator.controller");
const bmz_calculator_service_1 = require("./bmz-calculator.service");
const bmz_settings_entity_1 = require("./entities/bmz-settings.entity");
const bmz_area_price_entity_1 = require("./entities/bmz-area-price.entity");
const bmz_equipment_entity_1 = require("./entities/bmz-equipment.entity");
const bmz_wall_thickness_entity_1 = require("./entities/bmz-wall-thickness.entity");
let BmzModule = class BmzModule {
};
exports.BmzModule = BmzModule;
exports.BmzModule = BmzModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([bmz_settings_entity_1.BmzSettings, bmz_area_price_entity_1.BmzAreaPrice, bmz_equipment_entity_1.BmzEquipment, bmz_wall_thickness_entity_1.BmzWallThickness]),
        ],
        controllers: [bmz_settings_controller_1.BmzSettingsController, bmz_calculator_controller_1.BmzCalculatorController],
        providers: [bmz_settings_service_1.BmzSettingsService, bmz_calculator_service_1.BmzCalculatorService],
        exports: [bmz_settings_service_1.BmzSettingsService, bmz_calculator_service_1.BmzCalculatorService],
    })
], BmzModule);
//# sourceMappingURL=bmz.module.js.map