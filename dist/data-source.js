"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const setting_entity_1 = require("./settings/entities/setting.entity");
const user_entity_1 = require("./users/entities/user.entity");
const category_entity_1 = require("./categories/entities/category.entity");
const material_entity_1 = require("./materials/entities/material.entity");
const material_history_entity_1 = require("./materials/entities/material-history.entity");
const currency_settings_entity_1 = require("./currency-settings/entities/currency-settings.entity");
const bid_entity_1 = require("./bids/entities/bid.entity");
const calculation_group_entity_1 = require("./calculations/entities/calculation-group.entity");
const calculation_entity_1 = require("./calculations/entities/calculation.entity");
const transformer_entity_1 = require("./transformers/entities/transformer.entity");
const bmz_settings_entity_1 = require("./bmz/entities/bmz-settings.entity");
const switchgear_config_entity_1 = require("./switchgear/entities/switchgear-config.entity");
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'ep-spring-sun-a1m8k0rq-pooler.ap-southeast-1.aws.neon.tech',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'neondb_owner',
    password: process.env.DB_PASSWORD || 'npg_oceiQT3vR2JX',
    database: process.env.DB_NAME || 'neondb',
    entities: [
        setting_entity_1.Setting,
        user_entity_1.User,
        category_entity_1.Category,
        material_entity_1.Material,
        material_history_entity_1.MaterialHistory,
        currency_settings_entity_1.CurrencySettings,
        bid_entity_1.Bid,
        calculation_group_entity_1.CalculationGroup,
        calculation_entity_1.Calculation,
        transformer_entity_1.Transformer,
        bmz_settings_entity_1.BmzSettings,
        switchgear_config_entity_1.SwitchgearConfig
    ],
    migrations: [__dirname + '/migrations/*{.ts,.js}'],
    synchronize: false,
    ssl: {
        rejectUnauthorized: false
    }
});
//# sourceMappingURL=data-source.js.map