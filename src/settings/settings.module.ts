import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { Setting } from './entities/setting.entity';
import { Category } from '../categories/entities/category.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Setting, Category])],
    controllers: [SettingsController],
    providers: [SettingsService],
})
export class SettingsModule { } 