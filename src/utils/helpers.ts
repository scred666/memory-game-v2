import { shuffle } from 'lodash-es'

export const shuffleArray = <T>(array: T[]): T[] => {
  return shuffle(array)
}
