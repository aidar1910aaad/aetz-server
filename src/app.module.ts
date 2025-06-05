import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MaterialsModule } from './materials/materials.module';
import { CategoriesModule } from './categories/categories.module';
import { CalculationsModule } from './calculations/calculations.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { APP_GUARD } from '@nestjs/core';
import { SettingsModule } from './settings/settings.module';
import { CurrencySettingsModule } from './currency-settings/currency-settings.module';
import { JwtModule } from '@nestjs/jwt';
import { TransformersModule } from './transformers/transformers.module';
import { PassportModule } from '@nestjs/passport';
import { BmzModule } from './bmz/bmz.module';
import { User } from './users/entities/user.entity';
import { Setting } from './settings/entities/setting.entity';
import { CurrencySettings } from './currency-settings/entities/currency-settings.entity';
import { Material } from './materials/entities/material.entity';
import { Category } from './categories/entities/category.entity';
import { CalculationGroup } from './calculations/entities/calculation-group.entity';
import { Calculation } from './calculations/entities/calculation.entity';
import { Transformer } from './transformers/entities/transformer.entity';
import { BmzSettings } from './bmz/entities/bmz-settings.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [
          User,
          BmzSettings,
          Setting,
          CurrencySettings,
          Material,
          Category,
          CalculationGroup,
          Calculation,
          Transformer,
        ],
        synchronize: true,
        logging: true,
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
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { 
          expiresIn: configService.get('JWT_EXPIRES_IN'),
          algorithm: 'HS256',
        },
      }),
    }),
    AuthModule,
    UsersModule,
    MaterialsModule,
    CategoriesModule,
    CalculationsModule,
    SettingsModule,
    CurrencySettingsModule,
    TransformersModule,
    BmzModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}