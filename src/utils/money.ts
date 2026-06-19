const euroFormatter = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 2,
})

export function formatMoney(value: number) {
  return euroFormatter.format(value)
}
