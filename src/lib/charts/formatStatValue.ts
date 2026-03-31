import type { StatWidgetConfig } from '@/types/widget'

export function formatStatValue(value: number, format: StatWidgetConfig['format']): string {
  if (format === 'currency') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value)
  }
  if (format === 'percent') {
    return `${value.toFixed(1)}%`
  }
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value)
}

export function formatAssetClassLabel(assetClass: string): string {
  return assetClass
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
