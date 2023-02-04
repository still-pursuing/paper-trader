export function convertToUSDCurrency(number: number) {
  return number.toLocaleString('en', {
    style: 'currency',
    currency: 'USD',
  });
}
