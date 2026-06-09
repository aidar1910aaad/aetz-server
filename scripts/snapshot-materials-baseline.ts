import { Client } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import { normalizeCode } from '../src/materials/utils/material-price-import';

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

async function main() {
  const envPath = path.join(__dirname, '..', '.env');
  const env = { ...process.env, ...loadEnv(envPath) };

  const client = new Client({
    host: env.DB_HOST,
    port: parseInt(env.DB_PORT || '5432', 10),
    user: env.DB_USERNAME,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    ssl: env.DB_SSL === 'false' ? false : { rejectUnauthorized: false },
  });

  await client.connect();

  const { rows } = await client.query(`
    SELECT id, code, name, unit, currency, "priceInCurrency", price, "updatedAt"
    FROM material
    WHERE code IS NOT NULL AND TRIM(code) <> ''
    ORDER BY code
  `);

  const outDir = path.join(__dirname, '..', 'data');
  fs.mkdirSync(outDir, { recursive: true });

  const outPath = path.join(outDir, 'material-baseline.json');
  const payload = {
    exportedAt: new Date().toISOString(),
    database: env.DB_NAME,
    host: env.DB_HOST,
    total: rows.length,
    materials: rows.map((row) => ({
      ...row,
      code: normalizeCode(row.code),
    })),
  };

  fs.writeFileSync(outPath, JSON.stringify(payload, null, 2), 'utf8');
  await client.end();

  console.log(`Baseline saved: ${outPath}`);
  console.log(`Materials with code: ${rows.length}`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
