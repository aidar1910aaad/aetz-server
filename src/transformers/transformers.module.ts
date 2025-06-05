import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransformersService } from './transformers.service';
import { TransformersController } from './transformers.controller';
import { Transformer } from './entities/transformer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transformer])],
  controllers: [TransformersController],
  providers: [TransformersService],
  exports: [TransformersService],
})
export class TransformersModule {} 