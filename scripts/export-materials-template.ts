import { Client } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

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
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();

  const { rows } = await client.query(`
    SELECT id, code, name, unit, currency, "priceInCurrency", price
    FROM material
    ORDER BY code NULLS LAST, id
  `);

  const exportDir = path.join(__dirname, '..', 'exports');
  fs.mkdirSync(exportDir, { recursive: true });

  const csvPath = path.join(exportDir, 'materials-template.csv');
  const header = 'id,code,name,unit,currency,priceInCurrency,price,newPrice';
  const lines = rows.map((row) => {
    const escape = (value: unknown) => `"${String(value ?? '').replace(/"/g, '""')}"`;
    return [
      row.id,
      escape(row.code),
      escape(row.name),
      escape(row.unit),
      row.currency,
      row.priceInCurrency,
      row.price,
      '',
    ].join(',');
  });

  fs.writeFileSync(csvPath, [header, ...lines].join('\n'), 'utf8');
  await client.end();

  console.log(`Шаблон сохранён: ${csvPath}`);
  console.log(`Материалов: ${rows.length}`);
  console.log('Заполните колонку newPrice только для тех позиций, которые нужно обновить.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
