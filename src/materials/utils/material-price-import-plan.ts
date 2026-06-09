import { ExcelRow } from './material-price-import';

export const CHANGED_BY = 'excel-import';
export const PRICE_TOLERANCE = 0.01;
export const IMPORT_BADGES_PATH = 'data/material-import-badges.json';

export type DbMaterialForImport = {
  id: number;
  name: string;
  unit: string;
  currency: string;
  price: number;
  priceInCurrency: number;
};

export type PlannedUpdate = {
  kind: 'update';
  line: number;
  materialId: number;
  code: string;
  oldName: string;
  nextName: string;
  oldPrice: number;
  oldCurrency: string;
  nextPrice: number;
  updatePrice: boolean;
  updateName: boolean;
};

export type PlannedCreate = {
  kind: 'create';
  line: number;
  code: string;
  name: string;
  unit: string;
  price: number;
};

export type PlannedAction = PlannedUpdate | PlannedCreate;

export type ImportBadges = {
  appliedAt: string;
  excelFile: string;
  createdIds: number[];
  updatedIds: number[];
  byId: Record<string, 'create' | 'update'>;
};

function normalizeText(value: string): string {
  return value.trim().replace(/\s+/g, ' ');
}

function namesEqual(left: string, right: string): boolean {
  return normalizeText(left) === normalizeText(right);
}

export function planImportActions(
  excelRows: ExcelRow[],
  byCode: Map<string, DbMaterialForImport>
): PlannedAction[] {
  const actions: PlannedAction[] = [];

  for (const row of excelRows) {
    const material = byCode.get(row.code);

    if (material) {
      const updateName = !namesEqual(material.name, row.name);
      let updatePrice = false;
      let nextPrice = material.price;

      if (row.price !== null) {
        const currencyIsKzt = material.currency.toUpperCase() === 'KZT';
        const samePrice = currencyIsKzt && Math.abs(material.price - row.price) < PRICE_TOLERANCE;
        if (!samePrice) {
          updatePrice = true;
          nextPrice = row.price;
        }
      }

      if (!updateName && !updatePrice) continue;

      actions.push({
        kind: 'update',
        line: row.line,
        materialId: material.id,
        code: row.code,
        oldName: material.name,
        nextName: row.name,
        oldPrice: material.price,
        oldCurrency: material.currency,
        nextPrice,
        updatePrice,
        updateName,
      });
      continue;
    }

    actions.push({
      kind: 'create',
      line: row.line,
      code: row.code,
      name: row.name,
      unit: row.unit,
      price: row.price ?? 0,
    });
  }

  return actions;
}

export function buildImportBadges(
  excelFile: string,
  actions: PlannedAction[],
  createdIds: number[],
  updatedIds: number[]
): ImportBadges {
  const byId: Record<string, 'create' | 'update'> = {};
  for (const id of createdIds) byId[String(id)] = 'create';
  for (const id of updatedIds) byId[String(id)] = 'update';

  return {
    appliedAt: new Date().toISOString(),
    excelFile,
    createdIds,
    updatedIds,
    byId,
  };
}
