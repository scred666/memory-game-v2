import { shuffle } from 'lodash-es'

export const shuffleArray = <T>(array: T[]): T[] => shuffle(array)

export const TIMEOUT_DELAY = 400
