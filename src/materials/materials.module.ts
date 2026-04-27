import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaterialsService } from './materials.service';
import { MaterialsController } from './materials.controller';
import { Material } from './entities/material.entity';
import { MaterialHistory } from './entities/material-history.entity';
import { CurrencySettingsModule } from '../currency-settings/currency-settings.module';
import { Calculation } from '../calculations/entities/calculation.entity';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';

@Module({
  imports: [TypeOrmModule.forFeature([Material, MaterialHistory, Calculation]), CurrencySettingsModule, AuditLogsModule],
  controllers: [MaterialsController],
  providers: [MaterialsService],
})
export class MaterialsModule {}
