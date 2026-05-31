import { Injectable } from '@nestjs/common';
import { Material } from '../../materials/entities/material.entity';
import { getBusbarPricePerKgFromMap } from '../../materials/busbar-material.constants';

interface CatalogTransformer {
  id: number;
  model: string;
  voltage: string;
  type: string;
  power: number;
  manufacturer: string;
  price: number;
}

interface CatalogCalculation {
  id: number;
  name: string;
  slug: string;
  data: any;
}

interface PriceMaps {
  materialsMap: Map<number, number>;
  workPrices: Record<string, number>;
  pricingMeta: Record<string, any>;
  calculationSettings: {
    hourlyRate: number;
    overheadPercentage: number;
    adminPercentage: number;
    plannedProfitPercentage: number;
    ndsPercentage: number;
  } | null;
  bmzSettings?: Record<string, any> | null;
  transformersMap: Map<number, CatalogTransformer>;
  calculationsMap: Map<number, CatalogCalculation>;
}

interface InstallationWorkDetail {
  name: string;
  priceKey: string;
  unit: string;
  quantity: number;
  price: number;
  total: number;
}

@Injectable()
export class BidRepriceService {
  private toNumber(value: unknown): number {
    if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
    if (typeof value === 'string') {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : 0;
    }
    return 0;
  }

  private round(value: number): number {
    return Number(this.toNumber(value).toFixed(2));
  }

  private getRateByCurrency(settings: any, currency: string): number {
    switch ((currency || 'KZT').toUpperCase()) {
      case 'USD':
        return this.toNumber(settings?.usdRate) || 1;
      case 'EUR':
        return this.toNumber(settings?.eurRate) || 1;
      case 'RUB':
        return this.toNumber(settings?.rubRate) || 1;
      case 'CNY':
        return this.toNumber(settings?.cnyRate) || 1;
      case 'KZT':
      default:
        return this.toNumber(settings?.kztRate) || 1;
    }
  }

  private getMaterialCurrentPriceKzt(material: Material, currencySettings: any): number {
    const priceInCurrency = this.toNumber(material.priceInCurrency ?? material.price ?? 0);
    const rate = this.getRateByCurrency(currencySettings, material.currency || 'KZT');
    return this.round(priceInCurrency * (rate || 1));
  }

  buildPriceMaps(
    materials: Material[],
    currencySettings: any,
    workPrices: Record<string, number>,
    bmzSettings?: Record<string, any> | null,
    transformers: Array<{ id: number; model: string; voltage: string; type: string; power: number; manufacturer: string; price: number }> = [],
    calculations: Array<{ id: number; name: string; slug: string; data: any }> = []
  ): PriceMaps {
    const materialsMap = new Map<number, number>();
    for (const material of materials) {
      materialsMap.set(material.id, this.getMaterialCurrentPriceKzt(material, currencySettings));
    }

    const transformersMap = new Map<number, CatalogTransformer>();
    for (const transformer of transformers) {
      transformersMap.set(transformer.id, {
        id: transformer.id,
        model: transformer.model,
        voltage: transformer.voltage,
        type: transformer.type,
        power: transformer.power,
        manufacturer: transformer.manufacturer,
        price: this.round(this.toNumber(transformer.price)),
      });
    }

    const calculationsMap = new Map<number, CatalogCalculation>();
    for (const calculation of calculations) {
      calculationsMap.set(calculation.id, {
        id: calculation.id,
        name: calculation.name,
        slug: calculation.slug,
        data: calculation.data,
      });
    }

    const hasApiCalculationSettings =
      currencySettings &&
      ['hourlyWage', 'productionExpenses', 'administrativeExpenses', 'plannedSavings', 'vatRate'].some(
        (key) => currencySettings[key] !== undefined && currencySettings[key] !== null
      );
    const calculationSettings = hasApiCalculationSettings
      ? {
          hourlyRate: this.toNumber(currencySettings?.hourlyWage) || 2000,
          overheadPercentage: this.toNumber(currencySettings?.productionExpenses) || 10,
          adminPercentage: this.toNumber(currencySettings?.administrativeExpenses) || 15,
          plannedProfitPercentage: this.toNumber(currencySettings?.plannedSavings) || 10,
          ndsPercentage: this.toNumber(currencySettings?.vatRate) || 12,
        }
      : null;

    return {
      materialsMap,
      workPrices,
      calculationSettings,
      pricingMeta: {
        recalculatedAt: new Date().toISOString(),
        currencyRates: {
          usdRate: this.toNumber(currencySettings?.usdRate),
          eurRate: this.toNumber(currencySettings?.eurRate),
          rubRate: this.toNumber(currencySettings?.rubRate),
          cnyRate: this.toNumber(currencySettings?.cnyRate),
          kztRate: this.toNumber(currencySettings?.kztRate),
          defaultCurrency: currencySettings?.defaultCurrency || 'KZT',
        },
        calculationSettings,
        bmzSettingsUpdatedAt: bmzSettings?.updatedAt ?? null,
        transformersCount: transformersMap.size,
        calculationsCount: calculationsMap.size,
      },
      bmzSettings: bmzSettings || null,
      transformersMap,
      calculationsMap,
    };
  }

  private applyMaterialPricesToCalculationData(
    data: any,
    materialsMap: Map<number, number>,
    calculationSettings?: PriceMaps['calculationSettings']
  ): any {
    if (!data || typeof data !== 'object') {
      return data;
    }

    const nextData = { ...data };

    if (Array.isArray(nextData.categories)) {
      nextData.categories = nextData.categories.map((category: any) => {
        if (!Array.isArray(category?.items)) {
          return category;
        }

        return {
          ...category,
          items: category.items.map((item: any) => {
            if (item?.id && materialsMap.has(Number(item.id))) {
              return { ...item, price: materialsMap.get(Number(item.id)) };
            }
            return item;
          }),
        };
      });
    }

    if (nextData.cellConfig?.materials && typeof nextData.cellConfig.materials === 'object') {
      const materials = { ...nextData.cellConfig.materials };
      Object.keys(materials).forEach((key) => {
        const value = materials[key];
        if (Array.isArray(value)) {
          materials[key] = value.map((item: any) => {
            if (item?.id && materialsMap.has(Number(item.id))) {
              return { ...item, price: materialsMap.get(Number(item.id)) };
            }
            return item;
          });
          return;
        }

        if (value?.id && materialsMap.has(Number(value.id))) {
          materials[key] = { ...value, price: materialsMap.get(Number(value.id)) };
        }
      });

      nextData.cellConfig = {
        ...nextData.cellConfig,
        materials,
      };
    }

    if (nextData.calculation && calculationSettings) {
      nextData.calculation = {
        ...nextData.calculation,
        manufacturingHours: this.toNumber(nextData.calculation.manufacturingHours) || 4,
        ...calculationSettings,
      };
    }

    return nextData;
  }

  private refreshUstCalculation(calc: any, prices: PriceMaps): any {
    if (!calc) return calc;

    const calcId = Number(calc.id);
    if (calcId && prices.calculationsMap.has(calcId)) {
      const fresh = prices.calculationsMap.get(calcId)!;
      return {
        ...calc,
        id: fresh.id,
        name: fresh.name,
        slug: fresh.slug,
        data: this.applyMaterialPricesToCalculationData(
          fresh.data,
          prices.materialsMap,
          prices.calculationSettings
        ),
      };
    }

    if (calc.data) {
      return {
        ...calc,
        data: this.applyMaterialPricesToCalculationData(
          calc.data,
          prices.materialsMap,
          prices.calculationSettings
        ),
      };
    }

    return calc;
  }

  /** Заявки хранят трансформатор как объект или как { selected, total }. */
  private getTransformerPayload(transformer: any): any | null {
    if (!transformer || typeof transformer !== 'object') return null;
    if (transformer.selected && typeof transformer.selected === 'object') {
      return transformer.selected;
    }
    return transformer;
  }

  private setTransformerPayload(original: any, payload: any, total?: number): any {
    if (!payload) return original ?? null;
    if (original?.selected && typeof original.selected === 'object') {
      return {
        ...original,
        selected: payload,
        ...(total !== undefined ? { total: this.round(total) } : {}),
      };
    }
    return total !== undefined ? { ...payload, total: this.round(total) } : payload;
  }

  private refreshTransformerPayload(payload: any, prices: PriceMaps): any {
    if (!payload) return payload;

    let next = { ...payload };
    const transformerId = Number(next.id);
    if (transformerId && prices.transformersMap.has(transformerId)) {
      const fresh = prices.transformersMap.get(transformerId)!;
      next = {
        ...next,
        ...fresh,
        quantity: next.quantity,
        busbars: next.busbars,
        busbarUstData: next.busbarUstData,
      };
    }

    if (Array.isArray(next.ustCalculations)) {
      next.ustCalculations = next.ustCalculations.map((calc: any) =>
        this.refreshUstCalculation(calc, prices)
      );
    }

    if (next.ustCalculation) {
      next.ustCalculation = this.refreshUstCalculation(next.ustCalculation, prices);
    }

    return next;
  }

  private refreshTransformerConfig(transformer: any, prices: PriceMaps): any {
    if (!transformer) return transformer;
    const payload = this.getTransformerPayload(transformer);
    if (!payload) return transformer;
    const refreshed = this.refreshTransformerPayload(payload, prices);
    return this.setTransformerPayload(transformer, refreshed);
  }

  private syncLegacySections(
    sourceData: any,
    config: any,
    totals: {
      bmzTotal: number;
      transformerTotal: number;
      rusnTotal: number;
      runnTotal: number;
      additionalEquipmentTotal: number;
      worksTotal: number;
    }
  ): Record<string, any> {
    const legacy: Record<string, any> = {};

    if (config?.bmz) {
      legacy.bmz = { ...(sourceData.bmz || {}), ...config.bmz, total: totals.bmzTotal };
    }

    if (config?.transformer) {
      const refreshedPayload = this.getTransformerPayload(config.transformer);
      legacy.transformer = this.setTransformerPayload(
        sourceData.transformer || config.transformer,
        refreshedPayload,
        totals.transformerTotal
      );
    }

    if (config?.rusn) {
      legacy.rusn = { ...(sourceData.rusn || {}), ...config.rusn, total: totals.rusnTotal };
    }

    if (config?.runn) {
      legacy.runn = { ...(sourceData.runn || {}), ...config.runn, total: totals.runnTotal };
    }

    if (config?.additionalEquipment) {
      legacy.additionalEquipment = {
        ...(sourceData.additionalEquipment || {}),
        ...config.additionalEquipment,
        total: totals.additionalEquipmentTotal,
      };
    }

    if (config?.works) {
      legacy.works = {
        ...(sourceData.works || {}),
        ...config.works,
        total: totals.worksTotal,
      };
    }

    return legacy;
  }

  private repriceObjectById(entry: any, materialsMap: Map<number, number>): any {
    if (!entry || typeof entry !== 'object') return entry;
    if (!entry.id) return entry;
    const freshPrice = materialsMap.get(Number(entry.id));
    if (freshPrice === undefined) return entry;
    return { ...entry, price: freshPrice };
  }

  private repriceAny(value: any, materialsMap: Map<number, number>): any {
    if (Array.isArray(value)) {
      return value.map((item) => this.repriceAny(item, materialsMap));
    }

    if (!value || typeof value !== 'object') {
      return value;
    }

    const repriced = this.repriceObjectById(value, materialsMap);
    const next: Record<string, any> = { ...repriced };

    for (const key of Object.keys(next)) {
      if (key === 'price' && repriced.id && materialsMap.has(Number(repriced.id))) {
        next[key] = materialsMap.get(Number(repriced.id));
        continue;
      }
      next[key] = this.repriceAny(next[key], materialsMap);
    }

    const qty = this.toNumber(next.quantity ?? next.count ?? 1);
    const price = this.toNumber(next.price);
    if (price > 0 && qty > 0) {
      if (Object.prototype.hasOwnProperty.call(next, 'totalPrice')) {
        next.totalPrice = this.round(price * qty);
      }
      if (Object.prototype.hasOwnProperty.call(next, 'total')) {
        next.total = this.round(price * qty);
      }
    }

    return next;
  }

  private sumCustomRowsByTable(
    customRowsByTable: Record<string, any> | undefined,
    tableId: string
  ): number {
    const rows = customRowsByTable?.[tableId];
    if (!Array.isArray(rows)) return 0;
    return this.round(rows.reduce((sum, row) => sum + this.toNumber(row?.total), 0));
  }

  private calculateUstPrice(calc: any, additionalUstCost = 0): number {
    if (!calc?.data?.categories) return 0;

    let materialsTotal = 0;
    calc.data.categories.forEach((category: any) => {
      category.items?.forEach((item: any) => {
        materialsTotal += this.toNumber(item?.price) * this.toNumber(item?.quantity);
      });
    });

    const totalMaterialsWithUst = materialsTotal + this.toNumber(additionalUstCost);
    const calculation = calc.data.calculation;
    if (!calculation) return this.round(totalMaterialsWithUst);

    const manufacturingCost =
      this.toNumber(calculation.manufacturingHours) * this.toNumber(calculation.hourlyRate);
    const overheadCost =
      totalMaterialsWithUst * (this.toNumber(calculation.overheadPercentage) / 100);
    const productionCost = totalMaterialsWithUst + manufacturingCost + overheadCost;
    const adminCost = totalMaterialsWithUst * (this.toNumber(calculation.adminPercentage) / 100);
    const fullCost = productionCost + adminCost;
    const profitCost = fullCost * (this.toNumber(calculation.plannedProfitPercentage) / 100);
    const wholesalePrice = fullCost + profitCost;
    const vatCost = wholesalePrice * (this.toNumber(calculation.ndsPercentage) / 100);
    const finalPrice = wholesalePrice + vatCost;

    return this.round(finalPrice);
  }

  private calculateBusbarUstCost(
    busbarUstData: any,
    materialsMap: Map<number, number>
  ): number {
    if (!busbarUstData) return 0;
    const weight =
      this.toNumber(busbarUstData.mainUstWeight) + this.toNumber(busbarUstData.zeroUstWeight);
    if (weight <= 0) return 0;
    const pricePerKg = getBusbarPricePerKgFromMap(
      String(busbarUstData.material || ''),
      materialsMap
    );
    return this.round(weight * pricePerKg);
  }

  private calculateTransformerTotal(
    transformer: any,
    materialsMap: Map<number, number>,
    customRowsByTable?: Record<string, any>
  ): number {
    if (!transformer) return this.sumCustomRowsByTable(customRowsByTable, 'transformer');

    const payload = this.getTransformerPayload(transformer);
    if (!payload) return this.sumCustomRowsByTable(customRowsByTable, 'transformer');

    const quantity = this.toNumber(payload?.quantity) || 2;
    const basePrice = this.toNumber(payload?.price);
    const transformerBaseTotal = basePrice * quantity;

    let ustTotal = 0;
    const busbarUstData = payload?.busbarUstData;

    if (Array.isArray(payload?.ustCalculations) && payload.ustCalculations.length > 0) {
      payload.ustCalculations.forEach((calc: any) => {
        const calcName = String(calc?.name || '');
        const shouldAddBusbarCost = calcName.includes('0.4кВ') || calcName.includes('УСТ-0.4кВ');
        const additionalCost = shouldAddBusbarCost
          ? this.calculateBusbarUstCost(busbarUstData, materialsMap)
          : 0;
        ustTotal += this.calculateUstPrice(calc, additionalCost) * quantity;
      });
    } else if (payload?.ustCalculation) {
      ustTotal = this.calculateUstPrice(payload.ustCalculation) * quantity;
    }

    const custom = this.sumCustomRowsByTable(customRowsByTable, 'transformer');
    return this.round(transformerBaseTotal + ustTotal + custom);
  }

  private buildTransformerRows(
    transformer: any,
    materialsMap: Map<number, number>
  ): Array<{ name: string; unit: string; quantity: number; price: number; total: number }> {
    const payload = this.getTransformerPayload(transformer);
    if (!payload) return [];
    const quantity = this.toNumber(payload?.quantity) || 2;
    const rows: Array<{
      name: string;
      unit: string;
      quantity: number;
      price: number;
      total: number;
    }> = [];

    const transformerName = payload?.model || 'Силовой трансформатор';
    const basePrice = this.round(this.toNumber(payload?.price));
    rows.push({
      name: transformerName,
      unit: 'шт',
      quantity,
      price: basePrice,
      total: this.round(basePrice * quantity),
    });

    const busbarUstData = payload?.busbarUstData;

    if (Array.isArray(payload?.ustCalculations) && payload.ustCalculations.length > 0) {
      payload.ustCalculations.forEach((calc: any) => {
        const calcName = String(calc?.name || 'УСТ');
        const shouldAddBusbarCost = calcName.includes('0.4кВ') || calcName.includes('УСТ-0.4кВ');
        const additionalCost = shouldAddBusbarCost
          ? this.calculateBusbarUstCost(busbarUstData, materialsMap)
          : 0;
        const calcPrice = this.calculateUstPrice(calc, additionalCost);
        rows.push({
          name: calcName,
          unit: 'шт',
          quantity,
          price: calcPrice,
          total: this.round(calcPrice * quantity),
        });
      });
    } else if (payload?.ustCalculation) {
      const calcName = String(payload?.ustCalculation?.name || 'УСТ');
      const calcPrice = this.calculateUstPrice(payload.ustCalculation);
      rows.push({
        name: calcName,
        unit: 'шт',
        quantity,
        price: calcPrice,
        total: this.round(calcPrice * quantity),
      });
    }

    return rows;
  }

  private calculateBmzTotal(config: any, customRowsByTable?: Record<string, any>): number {
    const bmz = config?.bmz;
    if (!bmz || !bmz.buildingType || bmz.buildingType === 'none') {
      return this.sumCustomRowsByTable(customRowsByTable, 'bmz');
    }

    const area = (this.toNumber(bmz.length) / 1000) * (this.toNumber(bmz.width) / 1000);
    const roundedArea = Math.round(area);
    let total = 0;

    if (bmz.buildingType === 'bmz' && bmz.settings?.areaPriceRanges) {
      const thickness = this.toNumber(bmz.thickness);
      const height = this.toNumber(bmz.height);
      const matchingRanges = (bmz.settings.areaPriceRanges || [])
        .filter((range: any) => {
          const minHeight = range.minHeight ?? 0;
          const maxHeight = range.maxHeight ?? 999999;
          return (
            thickness >= this.toNumber(range.minWallThickness) &&
            thickness <= this.toNumber(range.maxWallThickness) &&
            area >= this.toNumber(range.minArea) &&
            area <= this.toNumber(range.maxArea) &&
            height >= minHeight &&
            height <= maxHeight
          );
        })
        .sort((a: any, b: any) => {
          const areaSpanA = this.toNumber(a.maxArea) - this.toNumber(a.minArea);
          const areaSpanB = this.toNumber(b.maxArea) - this.toNumber(b.minArea);
          if (areaSpanA !== areaSpanB) return areaSpanA - areaSpanB;
          const heightSpanA = this.toNumber(a.maxHeight ?? 999999) - this.toNumber(a.minHeight ?? 0);
          const heightSpanB = this.toNumber(b.maxHeight ?? 999999) - this.toNumber(b.minHeight ?? 0);
          return heightSpanA - heightSpanB;
        });
      const priceRange = matchingRanges[0];
      const unitPrice = this.toNumber(priceRange?.pricePerSquareMeter);
      total += unitPrice * roundedArea;
    }

    const equipment = bmz.settings?.equipment || [];
    equipment.forEach((eq: any) => {
      const stateKey = String(eq.name || '')
        .toLowerCase()
        .replace(/\s+/g, '');
      if (!bmz.equipmentState?.[stateKey]) return;
      let quantity = 0;
      if (eq.priceType === 'perSquareMeter') quantity = Math.round(area);
      else if (eq.priceType === 'perHalfSquareMeter') quantity = Math.round(area / 2);
      else if (eq.priceType === 'fixed') quantity = 1;
      const price = this.toNumber(eq.pricePerSquareMeter ?? eq.fixedPrice ?? 0);
      total += price * quantity;
    });

    const custom = this.sumCustomRowsByTable(customRowsByTable, 'bmz');
    return this.round(total + custom);
  }

  private calculateRusnTotal(
    config: any,
    snapshot: any,
    customRowsByTable?: Record<string, any>
  ): number {
    const rusn = config?.rusn || snapshot?.rusn || {};
    const cellConfigsTotal = Array.isArray(rusn?.cellConfigs)
      ? rusn.cellConfigs.reduce(
          (sum: number, cell: any) => sum + this.toNumber(cell?.totalPrice),
          0
        )
      : 0;
    const busBridge = this.toNumber(rusn?.busBridgeSummary?.totalPrice);
    const busbar = this.toNumber(rusn?.busbarSummary?.totalPrice);
    const custom = this.sumCustomRowsByTable(customRowsByTable, 'rusn');
    return this.round(cellConfigsTotal + busBridge + busbar + custom);
  }

  private mapRunnRows(runn: any): any[] {
    const rows: any[] = [];
    const cellSummaries = Array.isArray(runn?.cellSummaries) ? runn.cellSummaries : [];
    const cellConfigs = Array.isArray(runn?.cellConfigs) ? runn.cellConfigs : [];

    if (cellSummaries.length > 0) {
      cellSummaries.forEach((summary: any) => {
        rows.push({
          total: this.toNumber(summary?.totalPrice),
        });
      });
    } else {
      cellConfigs.forEach((c: any) => {
        const qty = this.toNumber(c?.quantity) || 1;
        const inferredFromParts = [
          'breakerPrice',
          'meterPrice',
          'rzaPrice',
          'transformerPrice',
        ].reduce((sum: number, key: string) => sum + this.toNumber(c?.[key]), 0);
        const total = this.toNumber(c?.totalPrice) || inferredFromParts;
        rows.push({ total, qty });
      });
    }

    if (runn?.busbarSummary) rows.push({ total: this.toNumber(runn.busbarSummary.totalPrice) });
    if (runn?.busBridgeSummary)
      rows.push({ total: this.toNumber(runn.busBridgeSummary.totalPrice) });
    if (Array.isArray(runn?.busBridgeSummaries)) {
      runn.busBridgeSummaries.forEach((bbs: any) =>
        rows.push({ total: this.toNumber(bbs?.totalPrice) })
      );
    }
    return rows;
  }

  private calculateRunnTotal(
    config: any,
    snapshot: any,
    customRowsByTable?: Record<string, any>
  ): number {
    const runn = config?.runn || snapshot?.runn || {};
    const rowTotal = this.round(
      this.mapRunnRows(runn).reduce((sum, row) => sum + this.toNumber(row.total), 0)
    );
    const custom = this.sumCustomRowsByTable(customRowsByTable, 'runn');
    return this.round(rowTotal + custom);
  }

  private calculateAdditionalEquipmentTotal(
    config: any,
    customRowsByTable?: Record<string, any>
  ): number {
    const additional = config?.additionalEquipment || {};
    const selected = additional.selected || {};
    let total = 0;
    Object.entries(selected).forEach(([, value]) => {
      const val: any = value;
      if (!val?.checked || this.toNumber(val?.count) <= 0) return;
      total += this.toNumber(val.price) * this.toNumber(val.count);
    });
    total += this.sumCustomRowsByTable(customRowsByTable, 'additional-equipment');
    return this.round(total);
  }

  private getWorkPrice(workPrices: Record<string, number>, key: string): number {
    return this.round(this.toNumber(workPrices?.[key]));
  }

  private pushInstallationDetail(
    details: InstallationWorkDetail[],
    detail: Omit<InstallationWorkDetail, 'total'>
  ): void {
    const quantity = this.toNumber(detail.quantity);
    const price = this.toNumber(detail.price);
    if (quantity <= 0 || price <= 0) return;

    details.push({
      ...detail,
      quantity: this.round(quantity),
      price: this.round(price),
      total: this.round(quantity * price),
    });
  }

  private calculateTieredDetails(
    details: InstallationWorkDetail[],
    options: {
      name: string;
      unit: string;
      quantity: number;
      tiers: Array<{ limit?: number; priceKey: string }>;
      workPrices: Record<string, number>;
    }
  ): void {
    let remaining = this.toNumber(options.quantity);
    let previousLimit = 0;

    for (const tier of options.tiers) {
      if (remaining <= 0) return;
      const limit = tier.limit ?? Number.POSITIVE_INFINITY;
      const tierCapacity = Math.max(limit - previousLimit, 0);
      const tierQuantity = Math.min(remaining, tierCapacity);
      const price = this.getWorkPrice(options.workPrices, tier.priceKey);

      this.pushInstallationDetail(details, {
        name: options.name,
        priceKey: tier.priceKey,
        unit: options.unit,
        quantity: tierQuantity,
        price,
      });

      remaining -= tierQuantity;
      previousLimit = limit;
    }
  }

  private getTransformerQuantity(config: any): number {
    const payload = this.getTransformerPayload(config?.transformer);
    return this.toNumber(payload?.quantity);
  }

  private getTransformerPower(config: any): number {
    const payload = this.getTransformerPayload(config?.transformer);
    return this.toNumber(payload?.power);
  }

  private getTransformerInstallationPriceKey(power: number): string {
    if (power <= 630) return 'transformerPrice630';
    if (power <= 1600) return 'transformerPrice1000';
    return 'transformerPrice2500';
  }

  private calculateBmzInstallationDetails(config: any, workPrices: Record<string, number>): InstallationWorkDetail[] {
    const bmz = config?.bmz;
    const details: InstallationWorkDetail[] = [];
    const blockCount = this.toNumber(bmz?.blockCount);

    if (!bmz || bmz.buildingType !== 'bmz' || blockCount <= 0) return details;

    this.calculateTieredDetails(details, {
      name: 'Монтаж БМЗ',
      unit: 'блок',
      quantity: blockCount,
      tiers: [
        { limit: 6, priceKey: 'bmzPriceUpTo6Blocks' },
        { priceKey: 'bmzPriceOver6Blocks' },
      ],
      workPrices,
    });

    const lengthM = this.toNumber(bmz.length) / 1000;
    const widthM = this.toNumber(bmz.width) / 1000;
    const groundingLength = lengthM > 0 && widthM > 0 ? this.round((lengthM + widthM) * 2) : 0;

    this.pushInstallationDetail(details, {
      name: 'Внешний контур заземления ТП',
      priceKey: 'bmzExternalGroundingPerMeter',
      unit: 'м',
      quantity: groundingLength,
      price: this.getWorkPrice(workPrices, 'bmzExternalGroundingPerMeter'),
    });
    this.pushInstallationDetail(details, {
      name: 'Внутренний контур заземления',
      priceKey: 'bmzInternalGroundingPerKit',
      unit: 'компл.',
      quantity: 1,
      price: this.getWorkPrice(workPrices, 'bmzInternalGroundingPerKit'),
    });
    this.pushInstallationDetail(details, {
      name: 'Монтаж кабельных металлических стоек и полок',
      priceKey: 'bmzCableRacks',
      unit: 'объект',
      quantity: 1,
      price: this.getWorkPrice(workPrices, 'bmzCableRacks'),
    });

    return details;
  }

  private countRusnCells(rusn: any): number {
    const cells = Array.isArray(rusn?.cellConfigs) ? rusn.cellConfigs : [];
    return cells.reduce((sum: number, cell: any) => sum + (this.toNumber(cell?.count) || 1), 0);
  }

  private countRusnBusBridges(rusn: any): number {
    const bridges = Array.isArray(rusn?.busBridges) ? rusn.busBridges : [];
    if (bridges.length > 0) {
      return bridges.reduce((sum: number, bridge: any) => sum + (this.toNumber(bridge?.quantity) || 1), 0);
    }
    const summaries = Array.isArray(rusn?.busBridgeSummaries) ? rusn.busBridgeSummaries : [];
    if (summaries.length > 0) {
      return summaries.reduce((sum: number, summary: any) => sum + (this.toNumber(summary?.quantity) || 1), 0);
    }
    return rusn?.busBridgeSummary ? this.toNumber(rusn.busBridgeSummary.quantity) || 1 : 0;
  }

  private calculateRusnInstallationDetails(config: any, workPrices: Record<string, number>): InstallationWorkDetail[] {
    const rusn = config?.rusn || {};
    const details: InstallationWorkDetail[] = [];
    const totalCellCount = this.countRusnCells(rusn);
    const busBridgeCount = this.countRusnBusBridges(rusn);
    const transformerQuantity = this.getTransformerQuantity(config);

    this.calculateTieredDetails(details, {
      name: 'Монтаж РУ-10/20 кВ с ШРЗ',
      unit: 'ячейка',
      quantity: totalCellCount,
      tiers: [
        { limit: 6, priceKey: 'rusnPriceUpTo6Cells' },
        { limit: 8, priceKey: 'rusnPrice6To8Cells' },
        { priceKey: 'rusnPriceOver8Cells' },
      ],
      workPrices,
    });

    if (busBridgeCount > 0) {
      this.pushInstallationDetail(details, {
        name: 'Шинный мост монтаж и изготовление',
        priceKey: 'rusnBusBridgePrice',
        unit: 'шт.',
        quantity: 1,
        price: this.getWorkPrice(workPrices, 'rusnBusBridgePrice'),
      });
      this.pushInstallationDetail(details, {
        name: 'Установка шинного моста',
        priceKey: 'rusnBusBridgeInstallationPrice',
        unit: 'шт.',
        quantity: busBridgeCount,
        price: this.getWorkPrice(workPrices, 'rusnBusBridgeInstallationPrice'),
      });
    }

    this.pushInstallationDetail(details, {
      name: 'Узел силового трансформатора 10/20 кВ',
      priceKey: 'rusnTransformerUnitPrice',
      unit: 'шт.',
      quantity: transformerQuantity,
      price: this.getWorkPrice(workPrices, 'rusnTransformerUnitPrice'),
    });

    return details;
  }

  private countRunnPanels(runn: any): number {
    const cells = Array.isArray(runn?.cellConfigs) ? runn.cellConfigs : [];
    return cells.reduce((sum: number, cell: any) => sum + (this.toNumber(cell?.quantity ?? cell?.count) || 1), 0);
  }

  private countRunnBusBridges(runn: any): number {
    const bridges = Array.isArray(runn?.busBridges) ? runn.busBridges : [];
    if (bridges.length > 0) {
      return bridges.reduce((sum: number, bridge: any) => sum + (this.toNumber(bridge?.quantity) || 1), 0);
    }
    const summaries = Array.isArray(runn?.busBridgeSummaries) ? runn.busBridgeSummaries : [];
    return summaries
      .filter((summary: any) => String(summary?.name || '').toLowerCase().includes('шинный мост'))
      .reduce((sum: number, summary: any) => sum + (this.toNumber(summary?.quantity) || 1), 0);
  }

  private getRunnTransformerUnitPriceKey(runn: any): string | null {
    const summaryName = String(runn?.busbarSummary?.name || '');
    const materialMatch = summaryName.match(/шина\s+(МТ|АД)\s*([23])?/i);
    const sizeMatch = summaryName.match(/10\s*[xх×]\s*(100|120|160)/i);
    if (!materialMatch || !sizeMatch) return null;

    const material = materialMatch[1].toLowerCase() === 'мт' ? 'Mt' : 'Ad';
    const multiplicity = materialMatch[2] === '3' ? 'Triple' : materialMatch[2] === '2' ? 'Double' : 'Single';
    return `runnUnit${material}10x${sizeMatch[1]}${multiplicity}`;
  }

  private calculateRunnInstallationDetails(config: any, workPrices: Record<string, number>): InstallationWorkDetail[] {
    const runn = config?.runn || {};
    const details: InstallationWorkDetail[] = [];
    const panelCount = this.countRunnPanels(runn);
    const busBridgeCount = this.countRunnBusBridges(runn);

    this.calculateTieredDetails(details, {
      name: 'Монтаж РУ-0,4 кВ',
      unit: 'панель',
      quantity: panelCount,
      tiers: [
        { limit: 7, priceKey: 'runnMountRu04UpTo7PerPanel' },
        { limit: 9, priceKey: 'runnMountRu048To9PerPanel' },
        { priceKey: 'runnMountRu04Over9PerPanel' },
      ],
      workPrices,
    });

    this.pushInstallationDetail(details, {
      name: 'Установка ШМ РУ-0,4 кВ',
      priceKey: 'runnShmInstallation',
      unit: 'шт.',
      quantity: busBridgeCount,
      price: this.getWorkPrice(workPrices, 'runnShmInstallation'),
    });

    const unitPriceKey = this.getRunnTransformerUnitPriceKey(runn);
    if (unitPriceKey) {
      this.pushInstallationDetail(details, {
        name: 'Узел силового трансформатора 0,4 кВ',
        priceKey: unitPriceKey,
        unit: 'шт.',
        quantity: this.getTransformerQuantity(config),
        price: this.getWorkPrice(workPrices, unitPriceKey),
      });
    }

    return details;
  }

  private calculateTransformerInstallationDetails(config: any, workPrices: Record<string, number>): InstallationWorkDetail[] {
    const details: InstallationWorkDetail[] = [];
    const quantity = this.getTransformerQuantity(config);
    const power = this.getTransformerPower(config);
    if (quantity <= 0 || power <= 0) return details;

    const priceKey = this.getTransformerInstallationPriceKey(power);
    this.pushInstallationDetail(details, {
      name: 'Монтаж трансформатора',
      priceKey,
      unit: 'шт.',
      quantity,
      price: this.getWorkPrice(workPrices, priceKey),
    });

    return details;
  }

  private calculateInstallationWorkDetails(config: any, workPrices: Record<string, number>): InstallationWorkDetail[] {
    return [
      ...this.calculateBmzInstallationDetails(config, workPrices),
      ...this.calculateRusnInstallationDetails(config, workPrices),
      ...this.calculateRunnInstallationDetails(config, workPrices),
      ...this.calculateTransformerInstallationDetails(config, workPrices),
    ];
  }

  private refreshWorksConfig(config: any, workPrices: Record<string, number>): any {
    const works = config?.works;
    if (!works || typeof works !== 'object') return works;

    const selected = { ...(works.selected || {}) };
    const list = Array.isArray(works.worksList) ? works.worksList : [];
    const aggregateName = 'Монтаж оборудования';
    const shouldCalculateInstallation =
      selected?.[aggregateName]?.checked ||
      list.some((work: any) => work?.name === aggregateName && selected?.[aggregateName]?.checked);

    const repricedList = list
      .filter((work: any) => work?.name !== aggregateName)
      .map((work: any) => {
        const workKey = String(work?.priceKey || '');
        const overriddenPrice = workKey ? workPrices?.[workKey] : undefined;
        const price = overriddenPrice ?? this.toNumber(work?.price);
        const count = this.toNumber(work?.count ?? work?.quantity ?? 1);
        return {
          ...work,
          price: this.round(price),
          total: this.round(price * (count || 1)),
        };
      });

    if (!shouldCalculateInstallation) {
      return {
        ...works,
        selected,
        worksList: repricedList,
      };
    }

    const calculationDetails = this.calculateInstallationWorkDetails(config, workPrices);
    const installationTotal = this.round(
      calculationDetails.reduce((sum, detail) => sum + this.toNumber(detail.total), 0)
    );

    selected[aggregateName] = {
      checked: true,
      count: 1,
    };

    return {
      ...works,
      selected,
      worksList: [
        ...repricedList,
        {
          name: aggregateName,
          price: installationTotal,
          total: installationTotal,
          unit: 'раб',
          category: aggregateName,
          calculationDetails,
        },
      ],
    };
  }

  private calculateWorksTotal(config: any, customRowsByTable?: Record<string, any>): number {
    const works = config?.works || {};
    const selected = works.selected || {};
    const list = Array.isArray(works.worksList) ? works.worksList : [];

    let total = 0;
    list.forEach((work: any) => {
      const key = String(work?.name || '');
      if (!selected?.[key]?.checked) return;
      // Эквивалент worksTableConfig: quantity всегда 1, total=price
      total += this.toNumber(work?.price);
    });
    total += this.sumCustomRowsByTable(customRowsByTable, 'works');
    return this.round(total);
  }

  private readonly markupTableIds = [
    'bmz',
    'transformer',
    'rusn',
    'runn',
    'works',
    'additional-equipment',
  ] as const;

  private recalculateMarkups(
    sourceData: any,
    sectionTotals: {
      bmzTotal: number;
      transformerTotal: number;
      rusnTotal: number;
      runnTotal: number;
      additionalEquipmentTotal: number;
      worksTotal: number;
    }
  ): {
    tableMarkupPercents: Record<string, number>;
    tableMarkupTotals: Record<string, number | null>;
  } {
    const oldPercents: Record<string, number> = {
      ...(sourceData?.tableMarkupPercents || {}),
    };
    const oldMarkupTotals: Record<string, number | null> = sourceData?.tableMarkupTotals || {};
    const oldSnapshotTotals = sourceData?.snapshot?.totals || {};

    const newBaseByTable: Record<string, number> = {
      bmz: sectionTotals.bmzTotal,
      transformer: sectionTotals.transformerTotal,
      rusn: sectionTotals.rusnTotal,
      runn: sectionTotals.runnTotal,
      works: sectionTotals.worksTotal,
      'additional-equipment': sectionTotals.additionalEquipmentTotal,
    };

    const oldBaseByTable: Record<string, number> = {
      bmz: this.toNumber(oldSnapshotTotals.bmzTotal),
      transformer: this.toNumber(oldSnapshotTotals.transformerTotal),
      rusn: this.toNumber(oldSnapshotTotals.rusnTotal),
      runn: this.toNumber(oldSnapshotTotals.runnTotal),
      works: this.toNumber(oldSnapshotTotals.worksTotal),
      'additional-equipment': this.toNumber(oldSnapshotTotals.additionalEquipmentTotal),
    };

    const tableMarkupPercents: Record<string, number> = { ...oldPercents };
    const tableMarkupTotals: Record<string, number | null> = {};

    for (const tableId of this.markupTableIds) {
      const newBase = this.toNumber(newBaseByTable[tableId]);
      if (newBase <= 0) {
        tableMarkupTotals[tableId] = null;
        continue;
      }

      const hasStoredPercent = Object.prototype.hasOwnProperty.call(oldPercents, tableId);
      let percent = hasStoredPercent ? this.toNumber(tableMarkupPercents[tableId]) : NaN;
      const oldMarkupTotal = oldMarkupTotals[tableId];
      const oldBase = this.toNumber(oldBaseByTable[tableId]);

      if (!Number.isFinite(percent) && oldMarkupTotal != null && oldBase > 0) {
        percent = this.round(((this.toNumber(oldMarkupTotal) / oldBase) - 1) * 100);
        tableMarkupPercents[tableId] = percent;
      }

      if (Number.isFinite(percent)) {
        tableMarkupTotals[tableId] = this.round(newBase * (1 + percent / 100));
      } else if (oldMarkupTotal != null && oldBase > 0) {
        tableMarkupTotals[tableId] = this.round((this.toNumber(oldMarkupTotal) / oldBase) * newBase);
        tableMarkupPercents[tableId] = this.round(
          ((this.toNumber(tableMarkupTotals[tableId]) / newBase) - 1) * 100
        );
      } else {
        tableMarkupTotals[tableId] = null;
      }
    }

    return { tableMarkupPercents, tableMarkupTotals };
  }

  private calculateManagerMarkupAmount(
    baseTotals: Record<string, number>,
    tableMarkupTotals: Record<string, number | null>
  ): number {
    const tableIdToBase: Record<string, number> = {
      bmz: baseTotals.bmzTotal,
      transformer: baseTotals.transformerTotal,
      rusn: baseTotals.rusnTotal,
      runn: baseTotals.runnTotal,
      works: baseTotals.worksTotal,
      'additional-equipment': baseTotals.additionalEquipmentTotal,
    };

    let totalMarkup = 0;
    Object.entries(tableIdToBase).forEach(([tableId, baseTotal]) => {
      if (baseTotal <= 0) return;
      const markupTotal = tableMarkupTotals?.[tableId];
      if (markupTotal !== null && markupTotal !== undefined) {
        totalMarkup += this.toNumber(markupTotal) - baseTotal;
      }
    });
    return this.round(totalMarkup);
  }

  private calcArrayTotal(rows: any[]): number {
    return this.round(
      (rows || []).reduce((sum, row) => {
        const total = this.toNumber(row?.totalPrice ?? row?.total);
        if (total) return sum + total;
        const price = this.toNumber(row?.price);
        const qty = this.toNumber(row?.quantity ?? row?.count ?? 1);
        return sum + price * (qty || 1);
      }, 0)
    );
  }

  private deriveSectionTotal(section: any, fallback = 0): number {
    if (!section || typeof section !== 'object') return this.round(fallback);
    if (this.toNumber(section.total) > 0) return this.round(this.toNumber(section.total));

    const candidateArrays = [
      'items',
      'worksList',
      'equipmentList',
      'cellSummaries',
      'cellConfigs',
      'rows',
    ];
    for (const key of candidateArrays) {
      if (Array.isArray(section[key])) {
        const total = this.calcArrayTotal(section[key]);
        if (total > 0) return total;
      }
    }

    return this.round(fallback);
  }

  repriceBidData(rawData: any, prices: PriceMaps, overrides?: Record<string, any>) {
    const sourceData = rawData && typeof rawData === 'object' ? rawData : {};
    const legacyConfig = sourceData.config || sourceData;
    const baseConfig = this.repriceAny(legacyConfig, prices.materialsMap);
    const config = {
      ...baseConfig,
      ...(overrides || {}),
    };

    // Для БМЗ всегда берем актуальные настройки с сервера, а не из клиентского payload.
    if (config?.bmz?.buildingType === 'bmz' && prices?.bmzSettings) {
      config.bmz = {
        ...config.bmz,
        settings: prices.bmzSettings,
      };
    }

    if (config?.works) {
      config.works = this.refreshWorksConfig(config, prices.workPrices);
    }

    if (config?.transformer) {
      config.transformer = this.refreshTransformerConfig(config.transformer, prices);
    }

    const snapshot = this.repriceAny(sourceData.snapshot || sourceData, prices.materialsMap);
    const customRowsByTable = sourceData?.customRowsByTable || {};
    const bmzTotal = this.calculateBmzTotal(config, customRowsByTable);
    const transformerRows = this.buildTransformerRows(config?.transformer, prices.materialsMap);
    const transformerBaseTotal = this.round(
      transformerRows.reduce((sum, row) => sum + this.toNumber(row.total), 0)
    );
    const transformerCustomTotal = this.sumCustomRowsByTable(customRowsByTable, 'transformer');
    const transformerTotal = this.round(transformerBaseTotal + transformerCustomTotal);
    if (config?.transformer) {
      config.transformer = this.setTransformerPayload(
        config.transformer,
        this.getTransformerPayload(config.transformer),
        transformerTotal
      );
    }
    const rusnTotal = this.calculateRusnTotal(config, snapshot, customRowsByTable);
    const runnTotal = this.calculateRunnTotal(config, snapshot, customRowsByTable);
    const additionalEquipmentTotal = this.calculateAdditionalEquipmentTotal(
      config,
      customRowsByTable
    );
    const worksTotal = this.calculateWorksTotal(config, customRowsByTable);
    const grandTotal = this.round(
      bmzTotal + transformerTotal + rusnTotal + runnTotal + additionalEquipmentTotal + worksTotal
    );

    const { tableMarkupPercents, tableMarkupTotals } = this.recalculateMarkups(sourceData, {
      bmzTotal,
      transformerTotal,
      rusnTotal,
      runnTotal,
      additionalEquipmentTotal,
      worksTotal,
    });

    const managerMarkupAmount = this.calculateManagerMarkupAmount(
      { bmzTotal, transformerTotal, rusnTotal, runnTotal, additionalEquipmentTotal, worksTotal },
      tableMarkupTotals
    );
    const finalTotal = this.round(grandTotal + managerMarkupAmount);

    const previousTotal = this.toNumber(
      sourceData?.snapshot?.totals?.grandTotal ?? sourceData?.grandTotal ?? 0
    );
    const repriceDiff = {
      previousGrandTotal: this.round(previousTotal),
      newGrandTotal: grandTotal,
      delta: this.round(grandTotal - previousTotal),
      managerMarkupAmount,
      finalTotal,
      sections: {
        bmzTotal,
        transformerTotal,
        rusnTotal,
        runnTotal,
        additionalEquipmentTotal,
        worksTotal,
      },
    };

    const nextSnapshot = {
      ...snapshot,
      bmz: { ...(snapshot?.bmz || {}), total: bmzTotal },
      transformer: {
        ...(snapshot?.transformer || {}),
        total: transformerTotal,
        rows: transformerRows,
        baseTotal: transformerBaseTotal,
        customTotal: transformerCustomTotal,
      },
      rusn: { ...(snapshot?.rusn || {}), total: rusnTotal },
      runn: { ...(snapshot?.runn || {}), total: runnTotal },
      additionalEquipment: {
        ...(snapshot?.additionalEquipment || {}),
        total: additionalEquipmentTotal,
      },
      works: { ...(snapshot?.works || {}), total: worksTotal },
      totals: {
        bmzTotal,
        transformerTotal,
        rusnTotal,
        runnTotal,
        additionalEquipmentTotal,
        worksTotal,
        grandTotal,
        managerMarkupAmount,
        finalTotal,
      },
    };

    const legacySections = this.syncLegacySections(sourceData, config, {
      bmzTotal,
      transformerTotal,
      rusnTotal,
      runnTotal,
      additionalEquipmentTotal,
      worksTotal,
    });

    return {
      data: {
        ...sourceData,
        ...legacySections,
        config,
        snapshot: nextSnapshot,
        tableMarkupPercents,
        tableMarkupTotals,
        managerMarkupPercent: sourceData?.managerMarkupPercent ?? null,
        pricingMeta: prices.pricingMeta,
        repriceDiff,
      },
      totalAmount: finalTotal,
      repriceDiff,
    };
  }
}
