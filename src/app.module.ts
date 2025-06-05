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
import { BmzSettings } from './bmz/entities/bmz-settings.entity';
import { BmzAreaPrice } from './bmz/entities/bmz-area-price.entity';
import { BmzEquipment } from './bmz/entities/bmz-equipment.entity';
import { User } from './users/entities/user.entity';
import { Setting } from './settings/entities/setting.entity';
import { CurrencySettings } from './currency-settings/entities/currency-settings.entity';
import { Material } from './materials/entities/material.entity';
import { Category } from './categories/entities/category.entity';
import { CalculationGroup } from './calculations/entities/calculation-group.entity';
import { Calculation } from './calculations/entities/calculation.entity';
import { Transformer } from './transformers/entities/transformer.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get('NODE_ENV') !== 'production',
        logging: configService.get('NODE_ENV') !== 'production',
        name: 'default',
      }),
      inject: [ConfigService],
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { 
          expiresIn: configService.get('JWT_EXPIRES_IN', '24h'),
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