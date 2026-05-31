import { Module } from '@nestjs/common';
import { BidsService } from './bids.service';
import { BidsController } from './bids.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bid } from './entities/bid.entity';
import { UsersModule } from '../users/users.module';
import { Material } from '../materials/entities/material.entity';
import { Transformer } from '../transformers/entities/transformer.entity';
import { Calculation } from '../calculations/entities/calculation.entity';
import { CurrencySettingsModule } from '../currency-settings/currency-settings.module';
import { WorkPricesSettingsModule } from '../work-prices-settings/work-prices-settings.module';
import { BmzSettingsModule } from '../bmz/bmz-settings.module';
import { BidRepriceService } from './services/bid-reprice.service';
import { BidPriceSourcesService } from './services/bid-price-sources.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bid, Material, Transformer, Calculation]),
    UsersModule,
    CurrencySettingsModule,
    WorkPricesSettingsModule,
    BmzSettingsModule,
  ],
  controllers: [BidsController],
  providers: [BidsService, BidRepriceService, BidPriceSourcesService],
})
export class BidsModule {}
