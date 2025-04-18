import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaterialsService } from './materials.service';
import { MaterialsController } from './materials.controller';
import { Material } from './entities/material.entity';
import { MaterialHistory } from './entities/material-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Material, MaterialHistory])],
  controllers: [MaterialsController],
  providers: [MaterialsService],
})
export class MaterialsModule {}
