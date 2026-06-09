import { Client } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import { QueryRunner } from 'typeorm';
import {
  DEFAULT_EXCEL_PATH,
  loadExcelRowsWithMeta,
  normalizeCode,
  toNumber,
  assertNoDuplicateCodes,
} from '../src/materials/utils/material-price-import';
import { saveImportBadges } from '../src/materials/utils/material-price-import-badges';
import { executeImportActions } from '../src/materials/utils/material-price-import-execute';
import {
  buildImportBadges,
  DbMaterialForImport,
  planImportActions,
} from '../src/materials/utils/material-price-import-plan';

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

function createPgQueryRunner(client: Client): QueryRunner {
  return {
    query: async (sql: string, params?: unknown[]) => {
      const result = await client.query(sql, params);
      return result.rows;
    },
  } as unknown as QueryRunner;
}

function printUsage() {
  console.log(`
Импорт цен материалов из Excel.

  npm run import:prices -- <файл.xlsx> [--apply] [--env .env.local]
`);
}

async function main() {
  const args = process.argv.slice(2);
  if (!args.length || args.includes('--help') || args.includes('-h')) {
    printUsage();
    process.exit(args.length ? 0 : 1);
  }

  const apply = args.includes('--apply');
  const envFlagIndex = args.indexOf('--env');
  const envFile =
    envFlagIndex >= 0 ? args[envFlagIndex + 1] : path.join(__dirname, '..', '.env');
  const filePath =
    args.find((arg, index) => {
      if (arg.startsWith('-')) return false;
      if (envFlagIndex >= 0 && index === envFlagIndex + 1) return false;
      return true;
    }) ?? DEFAULT_EXCEL_PATH;

  if (!fs.existsSync(filePath)) {
    console.error(`Файл не найден: ${filePath}`);
    process.exit(1);
  }

  const env = { ...loadEnv(path.resolve(envFile)), ...process.env } as Record<string, string>;
  const { rows: excelRows, duplicateCodes } = await loadExcelRowsWithMeta(path.resolve(filePath));
  assertNoDuplicateCodes(duplicateCodes);

  const client = new Client({
    host: env.DB_HOST,
    port: parseInt(env.DB_PORT || '5432', 10),
    user: env.DB_USERNAME,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    ssl: env.DB_SSL === 'false' ? false : { rejectUnauthorized: false },
  });

  await client.connect();

  const { rows: materials } = await client.query(
    `SELECT id, name, code, unit, currency, price::text, "priceInCurrency"::text
     FROM material
     WHERE code IS NOT NULL AND TRIM(code) <> ''`,
  );

  const byCode = new Map<string, DbMaterialForImport>();
  const snapshotsByCode = new Map<string, { priceInCurrency: number }>();

  for (const material of materials) {
    const code = normalizeCode(material.code);
    const snapshot: DbMaterialForImport = {
      id: material.id,
      name: material.name,
      unit: material.unit,
      currency: material.currency,
      price: toNumber(material.price),
      priceInCurrency: toNumber(material.priceInCurrency),
    };
    byCode.set(code, snapshot);
    snapshotsByCode.set(code, { priceInCurrency: snapshot.priceInCurrency });
  }

  const actions = planImportActions(excelRows, byCode);

  console.log(`База: ${env.DB_NAME} @ ${env.DB_HOST}`);
  console.log(`Файл: ${filePath}`);
  console.log(`Режим: ${apply ? 'APPLY' : 'DRY-RUN'}`);
  console.log(
    `Итого: обновить ${actions.filter((a) => a.kind === 'update').length}, создать ${actions.filter((a) => a.kind === 'create').length}`,
  );

  if (!apply || !actions.length) {
    if (!apply && actions.length) console.log('\nDry-run. Добавьте --apply для записи.');
    await client.end();
    return;
  }

  const queryRunner = createPgQueryRunner(client);
  await client.query('BEGIN');

  try {
    const { createdIds, updatedIds } = await executeImportActions(
      queryRunner,
      actions,
      snapshotsByCode,
    );
    const badges = buildImportBadges(filePath, actions, createdIds, updatedIds);
    const badgesPath = saveImportBadges(badges);
    await client.query('COMMIT');
    console.log(`\nГотово: обновлено ${updatedIds.length}, создано ${createdIds.length}.`);
    console.log(`Метки: ${badgesPath}`);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error('Import failed:', err.message || err);
  process.exit(1);
});
