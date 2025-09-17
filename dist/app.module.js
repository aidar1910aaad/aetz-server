"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const materials_module_1 = require("./materials/materials.module");
const categories_module_1 = require("./categories/categories.module");
const calculations_module_1 = require("./calculations/calculations.module");
const jwt_auth_guard_1 = require("./auth/guards/jwt-auth.guard");
const roles_guard_1 = require("./auth/guards/roles.guard");
const core_1 = require("@nestjs/core");
const settings_module_1 = require("./settings/settings.module");
const currency_settings_module_1 = require("./currency-settings/currency-settings.module");
const jwt_1 = require("@nestjs/jwt");
const transformers_module_1 = require("./transformers/transformers.module");
const passport_1 = require("@nestjs/passport");
const bmz_module_1 = require("./bmz/bmz.module");
const switchgear_module_1 = require("./switchgear/switchgear.module");
const user_entity_1 = require("./users/entities/user.entity");
const setting_entity_1 = require("./settings/entities/setting.entity");
const currency_settings_entity_1 = require("./currency-settings/entities/currency-settings.entity");
const material_entity_1 = require("./materials/entities/material.entity");
const category_entity_1 = require("./categories/entities/category.entity");
const calculation_group_entity_1 = require("./calculations/entities/calculation-group.entity");
const calculation_entity_1 = require("./calculations/entities/calculation.entity");
const transformer_entity_1 = require("./transformers/entities/transformer.entity");
const bmz_settings_entity_1 = require("./bmz/entities/bmz-settings.entity");
const switchgear_config_entity_1 = require("./switchgear/entities/switchgear-config.entity");
const material_history_entity_1 = require("./materials/entities/material-history.entity");
const bids_module_1 = require("./bids/bids.module");
const bid_entity_1 = require("./bids/entities/bid.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: process.env.DB_HOST || 'ep-spring-sun-a1m8k0rq-pooler.ap-southeast-1.aws.neon.tech',
                port: parseInt(process.env.DB_PORT || '5432', 10),
                username: process.env.DB_USERNAME || 'neondb_owner',
                password: process.env.DB_PASSWORD || 'npg_oceiQT3vR2JX',
                database: process.env.DB_NAME || 'neondb',
                entities: [
                    user_entity_1.User,
                    bmz_settings_entity_1.BmzSettings,
                    setting_entity_1.Setting,
                    currency_settings_entity_1.CurrencySettings,
                    material_entity_1.Material,
                    category_entity_1.Category,
                    calculation_group_entity_1.CalculationGroup,
                    calculation_entity_1.Calculation,
                    transformer_entity_1.Transformer,
                    switchgear_config_entity_1.SwitchgearConfig,
                    material_history_entity_1.MaterialHistory,
                    bid_entity_1.Bid,
                ],
                migrations: [__dirname + '/migrations/*{.ts,.js}'],
                migrationsRun: true,
                synchronize: false,
                logging: false,
                ssl: {
                    rejectUnauthorized: false,
                },
                extra: {
                    max: 10,
                    min: 1,
                    connectionTimeoutMillis: 10000,
                    idleTimeoutMillis: 30000,
                    maxUses: 7500,
                },
                retryAttempts: 10,
                retryDelay: 3000,
            }),
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET || 'supersecretkey',
                signOptions: {
                    expiresIn: process.env.JWT_EXPIRES_IN || '36000s',
                    algorithm: 'HS256',
                },
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            materials_module_1.MaterialsModule,
            categories_module_1.CategoriesModule,
            calculations_module_1.CalculationsModule,
            settings_module_1.SettingsModule,
            currency_settings_module_1.CurrencySettingsModule,
            transformers_module_1.TransformersModule,
            bmz_module_1.BmzModule,
            switchgear_module_1.SwitchgearModule,
            bids_module_1.BidsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            {
                provide: core_1.APP_GUARD,
                useClass: jwt_auth_guard_1.JwtAuthGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: roles_guard_1.RolesGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map