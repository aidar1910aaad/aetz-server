import * as fs from 'fs';
import * as path from 'path';
import { Client } from 'pg';
import {
  buildPriceImportPreview,
  DEFAULT_EXCEL_PATH,
  loadExcelRowsWithMeta,
  normalizeCode,
  toNumber,
} from '../src/materials/utils/material-price-import';

function loadEnv(filePath: string): Record<string, string> {
  const env: Record<string, string> = {};
  if (!fs.existsSync(filePath)) return env;
  for (const line of fs.readFileSync(filePath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  }
  return env;
}

async function loadMaterialsFromDb(env: Record<string, string>) {
  const client = new Client({
    host: env.DB_HOST,
    port: parseInt(env.DB_PORT || '5432', 10),
    user: env.DB_USERNAME,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    ssl: env.DB_SSL === 'false' ? false : { rejectUnauthorized: false },
  });

  await client.connect();
  const { rows } = await client.query(
    `SELECT id, name, code, unit, currency, price::text, "priceInCurrency"::text
     FROM material
     WHERE code IS NOT NULL AND TRIM(code) <> ''`,
  );
  await client.end();

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    code: row.code,
    unit: row.unit,
    currency: row.currency,
    price: toNumber(row.price),
    priceInCurrency: toNumber(row.priceInCurrency),
  }));
}

function loadMaterialsFromBaseline(baselinePath: string) {
  const parsed = JSON.parse(fs.readFileSync(baselinePath, 'utf8')) as
    | Array<Record<string, unknown>>
    | { materials?: Array<Record<string, unknown>> };
  const raw = Array.isArray(parsed) ? parsed : parsed.materials ?? [];
  return raw
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
}

async function main() {
  const args = process.argv.slice(2);
  const envFlagIndex = args.indexOf('--env');
  const baselineFlagIndex = args.indexOf('--baseline');
  const envFile =
    envFlagIndex >= 0 ? args[envFlagIndex + 1] : path.join(__dirname, '..', '.env');
  const excelPath = args.find((arg, index) => {
    if (arg.startsWith('-')) return false;
    if (envFlagIndex >= 0 && index === envFlagIndex + 1) return false;
    if (baselineFlagIndex >= 0 && index === baselineFlagIndex + 1) return false;
    return arg.endsWith('.xlsx') || arg.endsWith('.xls') || arg.endsWith('.csv');
  }) ?? DEFAULT_EXCEL_PATH;

  const env = { ...loadEnv(path.resolve(envFile)), ...process.env } as Record<string, string>;
  const { rows: excelRows, duplicateCodes } = await loadExcelRowsWithMeta(path.resolve(excelPath));

  let materials;
  let baselineSource: 'database' | 'snapshot' = 'database';

  if (baselineFlagIndex >= 0) {
    const baselinePath = path.resolve(args[baselineFlagIndex + 1]);
    materials = loadMaterialsFromBaseline(baselinePath);
    baselineSource = 'snapshot';
  } else {
    materials = await loadMaterialsFromDb(env);
  }

  const preview = buildPriceImportPreview(excelPath, excelRows, materials, duplicateCodes);
  preview.baselineSource = baselineSource;

  const outDir = path.join(__dirname, '..', 'data');
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, 'material-price-preview.json');
  fs.writeFileSync(outPath, JSON.stringify(preview, null, 2), 'utf8');

  console.log(`Preview saved: ${outPath}`);
  console.log(`Baseline: ${baselineSource}`);
  console.log(`Обновить: ${preview.summary.toUpdate}`);
  console.log(`Создать: ${preview.summary.toCreate}`);
  console.log(`Без изменений: ${preview.summary.unchanged}`);
  console.log(`Пропуск (пустая цена): ${preview.summary.skippedEmpty}`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
