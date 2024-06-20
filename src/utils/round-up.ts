export interface RoundUpOptions {
  value: number | undefined
  multiplier?: number
}

export const roundUp = ({ value = 0, multiplier = 50 }: RoundUpOptions): number => {
  if (multiplier <= 0 || !Number.isInteger(multiplier) || !Number.isFinite(multiplier)) return value

  if (!Number.isFinite(value)) return value

  return Math.ceil(value / multiplier) * multiplier
}
