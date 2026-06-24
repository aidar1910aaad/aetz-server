import {
  formatMaterialCode,
  isValidMaterialCodeFormat,
  MATERIAL_CODE_MIN,
  nextMaterialCodeFromMax,
} from './generate-material-code';

describe('generate-material-code', () => {
  it('formats known examples', () => {
    expect(formatMaterialCode(10_000_000_085)).toBe('10000000085');
    expect(formatMaterialCode(10_000_008_572)).toBe('10000008572');
    expect(formatMaterialCode(10_000_009_455)).toBe('10000009455');
  });

  it('validates 11-digit material codes', () => {
    expect(isValidMaterialCodeFormat('10000000085')).toBe(true);
    expect(isValidMaterialCodeFormat('10000008572')).toBe(true);
    expect(isValidMaterialCodeFormat('123')).toBe(false);
    expect(isValidMaterialCodeFormat('09999999999')).toBe(false);
  });

  it('generates next code from max existing', () => {
    expect(nextMaterialCodeFromMax(null)).toBe('10000000001');
    expect(nextMaterialCodeFromMax(MATERIAL_CODE_MIN)).toBe('10000000001');
    expect(nextMaterialCodeFromMax(10_000_009_455)).toBe('10000009456');
  });
});
