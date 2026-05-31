"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BidsModule = void 0;
const common_1 = require("@nestjs/common");
const bids_service_1 = require("./bids.service");
const bids_controller_1 = require("./bids.controller");
const typeorm_1 = require("@nestjs/typeorm");
const bid_entity_1 = require("./entities/bid.entity");
const users_module_1 = require("../users/users.module");
const material_entity_1 = require("../materials/entities/material.entity");
const transformer_entity_1 = require("../transformers/entities/transformer.entity");
const calculation_entity_1 = require("../calculations/entities/calculation.entity");
const currency_settings_module_1 = require("../currency-settings/currency-settings.module");
const work_prices_settings_module_1 = require("../work-prices-settings/work-prices-settings.module");
const bmz_settings_module_1 = require("../bmz/bmz-settings.module");
const bid_reprice_service_1 = require("./services/bid-reprice.service");
const bid_price_sources_service_1 = require("./services/bid-price-sources.service");
let BidsModule = class BidsModule {
};
exports.BidsModule = BidsModule;
exports.BidsModule = BidsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([bid_entity_1.Bid, material_entity_1.Material, transformer_entity_1.Transformer, calculation_entity_1.Calculation]),
            users_module_1.UsersModule,
            currency_settings_module_1.CurrencySettingsModule,
            work_prices_settings_module_1.WorkPricesSettingsModule,
            bmz_settings_module_1.BmzSettingsModule,
        ],
        controllers: [bids_controller_1.BidsController],
        providers: [bids_service_1.BidsService, bid_reprice_service_1.BidRepriceService, bid_price_sources_service_1.BidPriceSourcesService],
    })
], BidsModule);
//# sourceMappingURL=bids.module.js.map