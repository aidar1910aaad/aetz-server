import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Material } from '../../materials/entities/material.entity';
import { Transformer } from '../../transformers/entities/transformer.entity';
import { Calculation } from '../../calculations/entities/calculation.entity';
import { CurrencySettingsService } from '../../currency-settings/currency-settings.service';
import { WorkPricesSettingsService } from '../../work-prices-settings/work-prices-settings.service';
import { BmzSettingsService } from '../../bmz/bmz-settings.service';

@Injectable()
export class BidPriceSourcesService {
  constructor(
    @InjectRepository(Material)
    private readonly materialRepository: Repository<Material>,
    @InjectRepository(Transformer)
    private readonly transformerRepository: Repository<Transformer>,
    @InjectRepository(Calculation)
    private readonly calculationRepository: Repository<Calculation>,
    private readonly currencySettingsService: CurrencySettingsService,
    private readonly workPricesSettingsService: WorkPricesSettingsService,
    private readonly bmzSettingsService: BmzSettingsService
  ) {}

  async loadCurrentSources() {
    const [materials, currencySettings, workPrices, bmzSettings, transformers, calculations] =
      await Promise.all([
        this.materialRepository.find(),
        this.currencySettingsService.getSettings(),
        this.workPricesSettingsService.getSettings(),
        this.bmzSettingsService.getSettings(),
        this.transformerRepository.find({ order: { model: 'ASC' } }),
        this.calculationRepository.find(),
      ]);

    return {
      materials,
      currencySettings,
      workPrices,
      bmzSettings,
      transformers,
      calculations,
    };
  }
}
