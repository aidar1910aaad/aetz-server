import { DataSource } from 'typeorm';
import { Setting } from './settings/entities/setting.entity';
import { User } from './users/entities/user.entity';
import { Category } from './categories/entities/category.entity';
import { Material } from './materials/entities/material.entity';
import { MaterialHistory } from './materials/entities/material-history.entity';
import { CurrencySettings } from './currency-settings/entities/currency-settings.entity';
import { Bid } from './bids/entities/bid.entity';
import { CalculationGroup } from './calculations/entities/calculation-group.entity';
import { Calculation } from './calculations/entities/calculation.entity';
import { Transformer } from './transformers/entities/transformer.entity';
import { BmzSettings } from './bmz/entities/bmz-settings.entity';
import { SwitchgearConfig } from './switchgear/entities/switchgear-config.entity';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'ep-spring-sun-a1m8k0rq-pooler.ap-southeast-1.aws.neon.tech',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'neondb_owner',
    password: process.env.DB_PASSWORD || 'npg_oceiQT3vR2JX',
    database: process.env.DB_NAME || 'neondb',
    entities: [
        Setting,
        User,
        Category,
        Material,
        MaterialHistory,
        CurrencySettings,
        Bid,
        CalculationGroup,
        Calculation,
        Transformer,
        BmzSettings,
        SwitchgearConfig
    ],
    migrations: [__dirname + '/migrations/*{.ts,.js}'],
    synchronize: false,
    ssl: {
        rejectUnauthorized: false
    }
}); 