import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkPricesSettings } from './entities/work-prices-settings.entity';
import { DEFAULT_WORK_PRICES } from './work-prices-defaults';

@Injectable()
export class WorkPricesSettingsService {
  constructor(
    @InjectRepository(WorkPricesSettings)
    private readonly repo: Repository<WorkPricesSettings>,
  ) {
    this.initializeSettings();
  }

  private async initializeSettings() {
    const count = await this.repo.count();
    if (count > 0) return;

    const initial = this.repo.create({
      settings: { ...DEFAULT_WORK_PRICES },
    });
    await this.repo.save(initial);
  }

  private normalizeInput(input: Record<string, unknown>): Record<string, number> {
    const normalized: Record<string, number> = {};
    for (const key of Object.keys(DEFAULT_WORK_PRICES)) {
      if (input[key] === undefined) continue;
      const n = Number(input[key]);
      if (Number.isFinite(n)) {
        normalized[key] = Math.round(n);
      }
    }
    return normalized;
  }

  async getSettings(): Promise<Record<string, number>> {
    const row = await this.repo.findOne({ where: {}, order: { id: 'DESC' } });
    if (!row) {
      return { ...DEFAULT_WORK_PRICES };
    }
    return {
      ...DEFAULT_WORK_PRICES,
      ...(row.settings || {}),
    };
  }

  async updateSettings(patch: Record<string, unknown>): Promise<Record<string, number>> {
    const row = await this.repo.findOne({ where: {}, order: { id: 'DESC' } });
    const safePatch = this.normalizeInput(patch || {});

    if (!row) {
      const created = this.repo.create({
        settings: { ...DEFAULT_WORK_PRICES, ...safePatch },
      });
      const saved = await this.repo.save(created);
      return {
        ...DEFAULT_WORK_PRICES,
        ...(saved.settings || {}),
      };
    }

    row.settings = {
      ...DEFAULT_WORK_PRICES,
      ...(row.settings || {}),
      ...safePatch,
    };
    const saved = await this.repo.save(row);
    return {
      ...DEFAULT_WORK_PRICES,
      ...(saved.settings || {}),
    };
  }

  async resetToDefaults(): Promise<Record<string, number>> {
    return this.updateSettings({ ...DEFAULT_WORK_PRICES });
  }
}
