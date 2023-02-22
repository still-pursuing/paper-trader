import { describe, expect, test } from '@jest/globals';
import { convertToUSDCurrency } from '../helpers/dollarConverter';

describe('convert numbers to USD currency string', () => {
  test('1 becomes $1.00', () => {
    expect(convertToUSDCurrency(1)).toBe('$1.00');
  });
  test('126.324234 becomes $126.32', () => {
    expect(convertToUSDCurrency(126.324234)).toBe('$126.32');
  });
  test('0 becomes $0.00', () => {
    expect(convertToUSDCurrency(0)).toBe('$0.00');
  });
});
