import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SwitchgearController } from './switchgear.controller';
import { SwitchgearService } from './switchgear.service';
import { SwitchgearConfig } from './entities/switchgear-config.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SwitchgearConfig])],
  controllers: [SwitchgearController],
  providers: [SwitchgearService],
  exports: [SwitchgearService],
})
export class SwitchgearModule {} 