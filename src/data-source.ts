import { DataSource } from 'typeorm';
import { Setting } from './settings/entities/setting.entity';
import { User } from './users/entities/user.entity';
import { Category } from './categories/entities/category.entity';
import { Material } from './materials/entities/material.entity';
import { MaterialHistory } from './materials/entities/material-history.entity';
import { CurrencySettings } from './currency-settings/entities/currency-settings.entity';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'ep-spring-sun-a1m8k0rq-pooler.ap-southeast-1.aws.neon.tech',
    port: 5432,
    username: 'neondb_owner',
    password: 'npg_oceiQT3vR2JX',
    database: 'neondb',
    entities: [
        Setting,
        User,
        Category,
        Material,
        MaterialHistory,
        CurrencySettings
    ],
    synchronize: false,
    ssl: {
        rejectUnauthorized: false
    }
}); 