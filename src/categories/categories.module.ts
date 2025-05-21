import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Material } from '../materials/entities/material.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Material])],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService], // 👈 если нужно из других модулей
})
export class CategoriesModule { }
