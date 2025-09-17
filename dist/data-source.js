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
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: 'ep-spring-sun-a1m8k0rq-pooler.ap-southeast-1.aws.neon.tech',
    port: 5432,
    username: 'neondb_owner',
    password: 'npg_oceiQT3vR2JX',
    database: 'neondb',
    entities: [
        setting_entity_1.Setting,
        user_entity_1.User,
        category_entity_1.Category,
        material_entity_1.Material,
        material_history_entity_1.MaterialHistory,
        currency_settings_entity_1.CurrencySettings
    ],
    synchronize: false,
    ssl: {
        rejectUnauthorized: false
    }
});
//# sourceMappingURL=data-source.js.map