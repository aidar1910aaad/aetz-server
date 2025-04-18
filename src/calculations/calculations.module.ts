import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalculationsService } from './calculations.service';
import { CalculationsController } from './calculations.controller';
import { Calculation } from './entities/calculation.entity';
import { CalculationItem } from './entities/calculation-item.entity';
import { CalculationLog } from './entities/calculation-log.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Calculation,
      CalculationItem,
      CalculationLog,
    ]),
  ],
  controllers: [CalculationsController],
  providers: [CalculationsService],
})
export class CalculationsModule {}
