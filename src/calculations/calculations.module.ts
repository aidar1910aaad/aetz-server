import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalculationsService } from './calculations.service';
import { CalculationsController } from './calculations.controller';
import { CalculationGroup } from './entities/calculation-group.entity';
import { Calculation } from './entities/calculation.entity';
import { Material } from '../materials/entities/material.entity'; // 👈 уже есть

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CalculationGroup,
      Calculation,
      Material, // ✅ Добавь сюда
    ]),
  ],
  controllers: [CalculationsController],
  providers: [CalculationsService],
  exports: [CalculationsService],
})
export class CalculationsModule {}
