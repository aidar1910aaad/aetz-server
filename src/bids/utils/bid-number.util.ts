/** Разделитель в номере заявки: «AETZ – 2026 – 1» */
export const BID_NUMBER_SEPARATOR = ' – ';

export function formatBidNumber(year: number, sequence: number): string {
  return `AETZ${BID_NUMBER_SEPARATOR}${year}${BID_NUMBER_SEPARATOR}${sequence}`;
}

export function extractYearFromBidDate(date?: string): number {
  const fromDate = Number(String(date || '').slice(0, 4));
  if (Number.isFinite(fromDate) && fromDate >= 2000 && fromDate <= 2100) {
    return fromDate;
  }
  return new Date().getFullYear();
}

/** Порядковый номер заявки внутри года (только формат AETZ). */
export function parseAetzBidNumberSequence(bidNumber: string, targetYear: number): number | null {
  if (!bidNumber) {
    return null;
  }

  const trimmed = bidNumber.trim();
  const aetzMatch = trimmed.match(/^AETZ\s*[–\-]\s*(\d{4})\s*[–\-]\s*(\d+)/i);
  if (!aetzMatch) {
    return null;
  }

  const year = Number(aetzMatch[1]);
  const sequence = Number(aetzMatch[2]);
  if (year === targetYear && sequence > 0) {
    return sequence;
  }

  return null;
}
