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

  const { rows: tables } = await client.query<{ tablename: string }>(`
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public'
    ORDER BY tablename
  `);

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const exportDir = path.join(__dirname, '..', 'exports', `db-export-${timestamp}`);
  fs.mkdirSync(exportDir, { recursive: true });

  const summary: Record<string, number> = {};
  const allData: Record<string, unknown[]> = {};

  for (const { tablename } of tables) {
    const { rows } = await client.query(`SELECT * FROM "${tablename}"`);
    summary[tablename] = rows.length;
    allData[tablename] = rows;

    fs.writeFileSync(
      path.join(exportDir, `${tablename}.json`),
      JSON.stringify(rows, null, 2),
      'utf8',
    );
  }

  fs.writeFileSync(
    path.join(exportDir, '_all-data.json'),
    JSON.stringify(allData, null, 2),
    'utf8',
  );

  fs.writeFileSync(
    path.join(exportDir, '_summary.json'),
    JSON.stringify(
      {
        exportedAt: new Date().toISOString(),
        database: env.DB_NAME,
        host: env.DB_HOST,
        tables: summary,
        totalRows: Object.values(summary).reduce((a, b) => a + b, 0),
      },
      null,
      2,
    ),
    'utf8',
  );

  await client.end();

  console.log(`Export completed: ${exportDir}`);
  console.log('Tables:');
  for (const [table, count] of Object.entries(summary)) {
    console.log(`  ${table}: ${count} rows`);
  }
}

main().catch((err) => {
  console.error('Export failed:', err);
  process.exit(1);
});
