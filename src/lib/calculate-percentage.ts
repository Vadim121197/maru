export function calculatePercentage(value: number, total: number): number {
  if (!total) return 0
  return (value * 100) / total
}
