import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrencySettingsController } from './currency-settings.controller';
import { CurrencySettingsService } from './currency-settings.service';
import { CurrencySettings } from './entities/currency-settings.entity';
import { Material } from '../materials/entities/material.entity';
import { Calculation } from '../calculations/entities/calculation.entity';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';

@Module({
    imports: [TypeOrmModule.forFeature([CurrencySettings, Material, Calculation]), AuditLogsModule],
    controllers: [CurrencySettingsController],
    providers: [CurrencySettingsService],
    exports: [CurrencySettingsService],
})
export class CurrencySettingsModule { } 