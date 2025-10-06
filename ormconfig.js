const { DataSource } = require('typeorm');
const path = require('path');

module.exports = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'ep-spring-sun-a1m8k0rq-pooler.ap-southeast-1.aws.neon.tech',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'neondb_owner',
    password: process.env.DB_PASSWORD || 'npg_oceiQT3vR2JX',
    database: process.env.DB_NAME || 'neondb',
    entities: [
        path.join(__dirname, 'dist', '**', '*.entity.js')
    ],
    migrations: [
        path.join(__dirname, 'dist', 'migrations', '*.js')
    ],
    synchronize: false,
    ssl: {
        rejectUnauthorized: false
    }
});