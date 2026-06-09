import * as fs from 'fs';
import * as path from 'path';
import { ImportBadges, IMPORT_BADGES_PATH } from './material-price-import-plan';

export function saveImportBadges(badges: ImportBadges): string {
  const filePath = path.join(process.cwd(), IMPORT_BADGES_PATH);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(badges, null, 2), 'utf8');
  return filePath;
}

export function loadImportBadges(): ImportBadges | null {
  const filePath = path.join(process.cwd(), IMPORT_BADGES_PATH);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as ImportBadges;
}
