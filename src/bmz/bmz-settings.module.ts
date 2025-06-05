import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BmzSettings } from './entities/bmz-settings.entity';
import { BmzSettingsService } from './bmz-settings.service';
import { BmzSettingsController } from './bmz-settings.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BmzSettings])],
  controllers: [BmzSettingsController],
  providers: [BmzSettingsService],
  exports: [BmzSettingsService]
})
export class BmzSettingsModule {} 