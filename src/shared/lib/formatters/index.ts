export type FormatType = 'currency' | 'number' | 'percentage' | 'text'

export function formatValue(
  value: string | number,
  formatType: FormatType = 'text'
): string {
  if (typeof value === 'string') return value

  switch (formatType) {
    case 'currency':
      return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        maximumFractionDigits: 0,
      })
        .format(value)
        .replace('RUB', '₽')
    case 'number':
      return new Intl.NumberFormat('ru-RU').format(value)
    case 'percentage':
      return `${value}%`
    default:
      return value.toString()
  }
}