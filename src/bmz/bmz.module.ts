import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BmzSettingsController } from './bmz-settings.controller';
import { BmzSettingsService } from './bmz-settings.service';
import { BmzCalculatorController } from './bmz-calculator.controller';
import { BmzCalculatorService } from './bmz-calculator.service';
import { BmzSettings } from './entities/bmz-settings.entity';
import { BmzAreaPrice } from './entities/bmz-area-price.entity';
import { BmzEquipment } from './entities/bmz-equipment.entity';
import { BmzWallThickness } from './entities/bmz-wall-thickness.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([BmzSettings, BmzAreaPrice, BmzEquipment, BmzWallThickness]),
  ],
  controllers: [BmzSettingsController, BmzCalculatorController],
  providers: [BmzSettingsService, BmzCalculatorService],
  exports: [BmzSettingsService, BmzCalculatorService],
})
export class BmzModule {} 