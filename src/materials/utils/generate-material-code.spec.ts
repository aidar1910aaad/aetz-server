import {
  formatMaterialCode,
  isValidMaterialCodeFormat,
  MATERIAL_CODE_MIN,
  nextMaterialCodeFromMax,
} from './generate-material-code';

describe('generate-material-code', () => {
  it('formats known examples', () => {
    expect(formatMaterialCode(20_000_000_085)).toBe('20000000085');
    expect(formatMaterialCode(20_000_008_572)).toBe('20000008572');
    expect(formatMaterialCode(20_000_009_455)).toBe('20000009455');
  });

  it('validates 11-digit material codes', () => {
    expect(isValidMaterialCodeFormat('20000000085')).toBe(true);
    expect(isValidMaterialCodeFormat('20000008572')).toBe(true);
    expect(isValidMaterialCodeFormat('123')).toBe(false);
    expect(isValidMaterialCodeFormat('19999999999')).toBe(false);
  });

  it('generates next code from max existing', () => {
    expect(nextMaterialCodeFromMax(null)).toBe('20000000001');
    expect(nextMaterialCodeFromMax(MATERIAL_CODE_MIN)).toBe('20000000001');
    expect(nextMaterialCodeFromMax(20_000_009_455)).toBe('20000009456');
  });
});
