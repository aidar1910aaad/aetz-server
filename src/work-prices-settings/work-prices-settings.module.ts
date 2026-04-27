import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkPricesSettings } from './entities/work-prices-settings.entity';
import { WorkPricesSettingsController } from './work-prices-settings.controller';
import { WorkPricesSettingsService } from './work-prices-settings.service';

@Module({
  imports: [TypeOrmModule.forFeature([WorkPricesSettings])],
  controllers: [WorkPricesSettingsController],
  providers: [WorkPricesSettingsService],
  exports: [WorkPricesSettingsService],
})
export class WorkPricesSettingsModule {}
