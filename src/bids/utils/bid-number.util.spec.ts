import {
  extractYearFromBidDate,
  formatBidNumber,
  parseAetzBidNumberSequence,
} from './bid-number.util';

describe('bid-number.util', () => {
  it('formats AETZ bid number', () => {
    expect(formatBidNumber(2026, 1)).toBe('AETZ – 2026 – 1');
    expect(formatBidNumber(2026, 42)).toBe('AETZ – 2026 – 42');
  });

  it('parses AETZ bid numbers for a year', () => {
    expect(parseAetzBidNumberSequence('AETZ – 2026 – 1', 2026)).toBe(1);
    expect(parseAetzBidNumberSequence('AETZ - 2026 - 15', 2026)).toBe(15);
    expect(parseAetzBidNumberSequence('BID-2026-051', 2026)).toBeNull();
    expect(parseAetzBidNumberSequence('BID-2025-010', 2026)).toBeNull();
  });

  it('extracts year from bid date', () => {
    expect(extractYearFromBidDate('2026-05-31')).toBe(2026);
    expect(extractYearFromBidDate('invalid')).toBe(new Date().getFullYear());
  });
});
