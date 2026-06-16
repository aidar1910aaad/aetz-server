import * as fs from 'fs';
import * as path from 'path';

export const PRICE_TOLERANCE = 0.01;
export const DEFAULT_EXCEL_PATH = path.join(process.cwd(), 'data', 'data-materials.xlsx');
export const DEFAULT_BASELINE_PATH = path.join(process.cwd(), 'data', 'material-baseline.json');

export type ExcelRow = {
  line: number;
  code: string;
  name: string;
  unit: string;
  price: number | null;
};

export type DbMaterialSnapshot = {
  id: number;
  name: string;
  code: string;
  unit: string;
  currency: string;
  price: number;
  priceInCurrency: number;
};

export type PreviewAction = 'update' | 'create' | 'skip_unchanged' | 'skip_empty';

export type PriceImportPreviewRow = {
  line: number;
  code: string;
  name: string;
  action: PreviewAction;
  before: {
    id?: number;
    name?: string;
    unit?: string;
    currency?: string;
    price?: number;
  } | null;
  after: {
    name: string;
    unit: string;
    currency: 'KZT';
    price: number;
  } | null;
  priceDiff: number | null;
};

export type PriceImportPreview = {
  generatedAt: string;
  excelFile: string;
  baselineSource: 'database' | 'snapshot';
  baselineExportedAt?: string;
  summary: {
    totalExcelRows: number;
    toUpdate: number;
    toCreate: number;
    unchanged: number;
    skippedEmpty: number;
  };
  duplicateCodes: Array<{ code: string; lines: number[]; mergedName?: string }>;
  rows: PriceImportPreviewRow[];
};

function normalizeHeader(value: unknown): string {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '');
}

function detectColumn(headers: string[], aliases: string[]): number {
  for (let i = 0; i < headers.length; i += 1) {
    if (aliases.some((alias) => headers[i].includes(alias) || alias.includes(headers[i]))) {
      return i;
    }
  }
  return -1;
}

export function normalizeCode(raw: unknown): string {
  return String(raw ?? '')
    .trim()
    .replace(/\.0+$/, '');
}

function isEmptyPriceCell(raw: unknown): boolean {
  if (raw === '' || raw == null) return true;
  const text = String(raw).trim();
  return !text || /^[-—–]+$/.test(text);
}

export function parsePrice(raw: unknown): number | null {
  if (isEmptyPriceCell(raw)) return null;

  if (typeof raw === 'number' && Number.isFinite(raw)) return raw;

  const asString = String(raw).trim();
  if (!asString) return null;

  let s = asString.replace(/\s/g, '');
  const hasComma = s.includes(',');
  const hasDot = s.includes('.');

  if (hasComma && hasDot) {
    if (s.lastIndexOf('.') > s.lastIndexOf(',')) {
      s = s.replace(/,/g, '');
    } else {
      s = s.replace(/\./g, '').replace(',', '.');
    }
  } else if (hasComma) {
    s = s.replace(',', '.');
  }

  const parsed = Number(s);
  return Number.isFinite(parsed) ? parsed : null;
}

export function toNumber(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function parseCsv(content: string): unknown[][] {
  const rows: unknown[][] = [];
  let row: string[] = [];
  let cell = '';
  let inQuotes = false;

  for (let i = 0; i < content.length; i += 1) {
    const ch = content[i];
    const next = content[i + 1];

    if (inQuotes) {
      if (ch === '"' && next === '"') {
        cell += '"';
        i += 1;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        cell += ch;
      }
      continue;
    }

    if (ch === '"') {
      inQuotes = true;
      continue;
    }

    if (ch === ',') {
      row.push(cell);
      cell = '';
      continue;
    }

    if (ch === '\n') {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
      continue;
    }

    if (ch === '\r') continue;
    cell += ch;
  }

  if (cell.length > 0 || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }

  return rows;
}

export async function readSpreadsheet(filePath: string): Promise<unknown[][]> {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === '.csv') {
    const raw = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
    return parseCsv(raw);
  }

  if (ext === '.xlsx' || ext === '.xls') {
    const xlsx = await import('xlsx');
    const workbook = xlsx.read(fs.readFileSync(filePath), { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    return xlsx.utils.sheet_to_json(sheet, { header: 1, defval: '' });
  }

  throw new Error('Поддерживаются только .xlsx, .xls и .csv');
}

export function parseExcelRows(table: unknown[][]): {
  rows: ExcelRow[];
  duplicateCodes: Array<{ code: string; lines: number[] }>;
} {
  if (!table.length) {
    throw new Error('Файл пустой');
  }

  const headers = (table[0] ?? []).map(normalizeHeader);
  const codeCol = detectColumn(headers, [
    'номенклатурныйномер',
    'номенклатура',
    'code',
    'код',
    'артикул',
  ]);
  const nameCol = detectColumn(headers, ['наименованиеновое', 'наименование', 'name']);
  const unitCol = detectColumn(headers, ['едиз', 'единица', 'unit']);
  const priceCol = detectColumn(headers, [
    'ценанаиюнь',
    'ценанаиюньтенге',
    'цена',
    'price',
    'стоимость',
  ]);

  if (codeCol === -1) {
    throw new Error('Не найдена колонка «Номенклатурный номер»');
  }
  if (nameCol === -1) {
    throw new Error('Не найдена колонка «Наименование новое»');
  }
  if (priceCol === -1) {
    throw new Error('Не найдена колонка «Цена на июнь, тенге»');
  }

  const rows: ExcelRow[] = [];
  const codeLines = new Map<string, number[]>();

  for (let i = 1; i < table.length; i += 1) {
    const line = table[i] ?? [];
    const code = normalizeCode(line[codeCol]);
    const name = String(line[nameCol] ?? '').trim();
    const unit = String(unitCol >= 0 ? (line[unitCol] ?? '') : '').trim() || 'шт';
    const rawPrice = line[priceCol];
    const price = parsePrice(rawPrice);

    if (!code && !name) continue;
    if (!code) {
      throw new Error(`Строка ${i + 1}: есть наименование, но нет номенклатурного номера`);
    }

    const priceLooksFilled = !isEmptyPriceCell(rawPrice);

    if (priceLooksFilled && price === null) {
      throw new Error(`Строка ${i + 1}: некорректная цена "${String(rawPrice)}"`);
    }

    const existingLines = codeLines.get(code) ?? [];
    existingLines.push(i + 1);
    codeLines.set(code, existingLines);

    rows.push({
      line: i + 1,
      code,
      name: name || code,
      unit,
      price,
    });
  }

  return mergeRowsByCode(rows);
}

export async function loadExcelRows(filePath: string): Promise<ExcelRow[]> {
  const { rows } = await loadExcelRowsWithMeta(filePath);
  return rows;
}

export async function loadExcelRowsWithMeta(filePath: string) {
  return parseExcelRows(await readSpreadsheet(filePath));
}

export function assertNoDuplicateCodes(
  duplicateCodes: Array<{ code: string; lines: number[]; mergedName?: string }>
): void {
  // Duplicates are merged automatically when prices match.
  void duplicateCodes;
}

function longestCommonPrefix(values: string[]): string {
  if (!values.length) return '';
  let prefix = values[0];
  for (const value of values.slice(1)) {
    while (!value.startsWith(prefix) && prefix.length > 0) {
      prefix = prefix.slice(0, -1);
    }
  }
  return prefix;
}

function normalizeColorWord(text: string): string {
  return text
    .replace(/\bзеленый\b/gi, 'зеленая')
    .replace(/\bзелёный\b/gi, 'зеленая')
    .replace(/\bкрасный\b/gi, 'красная')
    .replace(/\bсиний\b/gi, 'синяя')
    .replace(/\bжелтый\b/gi, 'желтая')
    .replace(/\bжёлтый\b/gi, 'желтая')
    .replace(/\bбелый\b/gi, 'белая')
    .replace(/\bчерный\b/gi, 'черная')
    .replace(/\bчёрный\b/gi, 'черная');
}

function mergeMaterialNames(names: string[]): string {
  if (names.length === 1) return names[0];

  const normalized = names.map((name) => normalizeColorWord(name.trim()));
  const parts = normalized.map((name) => {
    const parenMatch = name.match(/\(([^)]+)\)\s*$/);
    const color = parenMatch?.[1]?.trim();
    const withoutParen = name.replace(/\s*\([^)]+\)\s*$/, '').trim();
    return { name, withoutParen, color };
  });

  const bases = parts.map((part) => part.withoutParen);
  let commonPrefix = longestCommonPrefix(bases);

  const dashIndex = commonPrefix.lastIndexOf('-');
  if (dashIndex > commonPrefix.length - 4 && dashIndex >= 10) {
    commonPrefix = commonPrefix.slice(0, dashIndex + 1);
  }

  if (commonPrefix.length >= 10) {
    const variants = parts
      .map((part) => {
        const model = part.withoutParen.slice(commonPrefix.length).trim();
        if (model && part.color) return `${model} (${normalizeColorWord(part.color)})`;
        if (model) return model;
        if (part.color) return part.color;
        return part.withoutParen;
      })
      .filter(Boolean);

    return `${commonPrefix.trim()} ${variants.join(', ')}`.replace(/\s+/g, ' ').trim();
  }

  return normalized.join(' / ');
}

function mergeDuplicatePrices(prices: Array<number | null>, lines: number[]): number | null {
  const filled = prices.filter((price): price is number => price !== null);
  if (!filled.length) return null;

  const first = filled[0];
  const allSame = filled.every((price) => pricesEqual(price, first));
  if (!allSame) {
    throw new Error(
      `Строки ${lines.join(', ')}: один code, но разные цены (${filled.join(' / ')})`
    );
  }

  return first;
}

function mergeRowsByCode(rows: ExcelRow[]): {
  rows: ExcelRow[];
  duplicateCodes: Array<{ code: string; lines: number[]; mergedName?: string }>;
} {
  const grouped = new Map<string, ExcelRow[]>();
  for (const row of rows) {
    const group = grouped.get(row.code) ?? [];
    group.push(row);
    grouped.set(row.code, group);
  }

  const mergedRows: ExcelRow[] = [];
  const duplicateCodes: Array<{ code: string; lines: number[]; mergedName?: string }> = [];

  for (const [code, group] of grouped) {
    if (group.length === 1) {
      mergedRows.push(group[0]);
      continue;
    }

    const lines = group.map((row) => row.line);
    const mergedName = mergeMaterialNames(group.map((row) => row.name));
    const mergedPrice = mergeDuplicatePrices(
      group.map((row) => row.price),
      lines
    );
    const mergedUnit = group.find((row) => row.unit)?.unit || 'шт';

    duplicateCodes.push({ code, lines, mergedName });

    mergedRows.push({
      line: lines[0],
      code,
      name: mergedName,
      unit: mergedUnit,
      price: mergedPrice,
    });
  }

  return { rows: mergedRows, duplicateCodes };
}

function pricesEqual(current: number, next: number): boolean {
  return Math.abs(current - next) < PRICE_TOLERANCE;
}

export function loadBaselineMaterials(
  baselinePath = DEFAULT_BASELINE_PATH
): { materials: DbMaterialSnapshot[]; exportedAt?: string } | null {
  if (!fs.existsSync(baselinePath)) return null;

  const parsed = JSON.parse(fs.readFileSync(baselinePath, 'utf8')) as
    | Array<Record<string, unknown>>
    | { materials?: Array<Record<string, unknown>>; exportedAt?: string };

  const raw = Array.isArray(parsed) ? parsed : (parsed.materials ?? []);
  const exportedAt = Array.isArray(parsed) ? undefined : parsed.exportedAt;

  const materials = raw
    .filter((row) => row.code)
    .map((row) => ({
      id: Number(row.id),
      name: String(row.name ?? ''),
      code: String(row.code),
      unit: String(row.unit ?? 'шт'),
      currency: String(row.currency ?? 'KZT'),
      price: toNumber(row.price),
      priceInCurrency: toNumber(row.priceInCurrency ?? row.price),
    }));

  return { materials, exportedAt };
}

export function buildPriceImportPreview(
  excelFile: string,
  excelRows: ExcelRow[],
  materials: DbMaterialSnapshot[],
  duplicateCodes: Array<{ code: string; lines: number[]; mergedName?: string }> = [],
  options: {
    baselineSource?: 'database' | 'snapshot';
    baselineExportedAt?: string;
  } = {}
): PriceImportPreview {
  const byCode = new Map<string, DbMaterialSnapshot>();
  for (const material of materials) {
    if (material.code) {
      byCode.set(normalizeCode(material.code), material);
    }
  }

  const rows: PriceImportPreviewRow[] = [];
  let toUpdate = 0;
  let toCreate = 0;
  let unchanged = 0;
  let skippedEmpty = 0;

  for (const row of excelRows) {
    const material = byCode.get(row.code);

    if (material) {
      const excelName = row.name;

      if (row.price === null) {
        skippedEmpty += 1;
        rows.push({
          line: row.line,
          code: row.code,
          name: excelName,
          action: 'skip_empty',
          before: {
            id: material.id,
            name: material.name,
            unit: material.unit,
            currency: material.currency,
            price: material.price,
          },
          after: {
            name: excelName,
            unit: material.unit,
            currency: 'KZT',
            price: material.price,
          },
          priceDiff: 0,
        });
        continue;
      }

      const currencyIsKzt = material.currency.toUpperCase() === 'KZT';
      const samePrice = currencyIsKzt && pricesEqual(material.price, row.price);

      if (samePrice) {
        unchanged += 1;
        rows.push({
          line: row.line,
          code: row.code,
          name: excelName,
          action: 'skip_unchanged',
          before: {
            id: material.id,
            name: material.name,
            unit: material.unit,
            currency: material.currency,
            price: material.price,
          },
          after: {
            name: excelName,
            unit: material.unit,
            currency: 'KZT',
            price: row.price,
          },
          priceDiff: 0,
        });
        continue;
      }

      toUpdate += 1;
      rows.push({
        line: row.line,
        code: row.code,
        name: excelName,
        action: 'update',
        before: {
          id: material.id,
          name: material.name,
          unit: material.unit,
          currency: material.currency,
          price: material.price,
        },
        after: {
          name: excelName,
          unit: material.unit,
          currency: 'KZT',
          price: row.price,
        },
        priceDiff: Number((row.price - material.price).toFixed(2)),
      });
      continue;
    }

    const nextPrice = row.price ?? 0;
    toCreate += 1;
    rows.push({
      line: row.line,
      code: row.code,
      name: row.name,
      action: 'create',
      before: null,
      after: {
        name: row.name,
        unit: row.unit,
        currency: 'KZT',
        price: nextPrice,
      },
      priceDiff: null,
    });
  }

  return {
    generatedAt: new Date().toISOString(),
    excelFile,
    baselineSource: options.baselineSource ?? 'database',
    baselineExportedAt: options.baselineExportedAt,
    summary: {
      totalExcelRows: excelRows.length,
      toUpdate,
      toCreate,
      unchanged,
      skippedEmpty,
    },
    duplicateCodes,
    rows,
  };
}
