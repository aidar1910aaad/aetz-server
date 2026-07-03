export const MATERIAL_CODE_MIN = 20_000_000_000;
export const MATERIAL_CODE_LENGTH = 11;

export function formatMaterialCode(value: number): string {
  if (!Number.isSafeInteger(value) || value < MATERIAL_CODE_MIN) {
    throw new Error(`Material code must be an integer >= ${MATERIAL_CODE_MIN}`);
  }

  return String(value).padStart(MATERIAL_CODE_LENGTH, '0');
}

export function isValidMaterialCodeFormat(code: string): boolean {
  if (!/^\d{11}$/.test(code)) {
    return false;
  }

  const numeric = Number(code);
  return Number.isSafeInteger(numeric) && numeric >= MATERIAL_CODE_MIN;
}

export function nextMaterialCodeFromMax(maxExisting: number | null | undefined): string {
  const base = Math.max(maxExisting ?? 0, MATERIAL_CODE_MIN);
  return formatMaterialCode(base + 1);
}
