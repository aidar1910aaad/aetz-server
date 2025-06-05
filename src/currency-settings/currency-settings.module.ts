import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrencySettingsController } from './currency-settings.controller';
import { CurrencySettingsService } from './currency-settings.service';
import { CurrencySettings } from './entities/currency-settings.entity';

@Module({
    imports: [TypeOrmModule.forFeature([CurrencySettings])],
    controllers: [CurrencySettingsController],
    providers: [CurrencySettingsService],
    exports: [CurrencySettingsService],
})
export class CurrencySettingsModule { } 