import { shuffle } from 'lodash-es'

export const shuffleArray = <T>(array: T[]): T[] => shuffle(array)

export const TIMEOUT_DELAY = 400

export const roundUp = ({
  value,
  multiplier = 50
}: {
  value: number
  multiplier?: number
}): number => {
  if (multiplier <= 0 || !Number.isInteger(multiplier) || !Number.isFinite(multiplier)) return value

  if (!Number.isFinite(value)) return value

  return Math.ceil(value / multiplier) * multiplier
}
