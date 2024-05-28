import { EMOJI_LIST } from '@/utils/emoji'
import { roundUp } from '@/utils/helpers'

export const DIFFICULTY_KEYS = {
  COLOR: 'color',
  COUNT: 'count',
  NAME: 'name',
  ATTEMPTS: 'attempts'
} as const

const { COLOR, COUNT, NAME, ATTEMPTS } = DIFFICULTY_KEYS

export interface Difficult {
  [COLOR]: string
  [COUNT]: number
  [NAME]: string
  [ATTEMPTS]: number
}

const calculateQuantities = (n: number): Pick<Difficult, 'attempts' | 'count'> => {
  const attempts = roundUp({ value: n * 4 })

  return {
    [COUNT]: n,
    [ATTEMPTS]: attempts
  }
}

export const DIFFICULTIES: Record<string, Difficult> = {
  EASY: {
    [COLOR]: '--vt-green',
    [NAME]: 'Easy',
    [COUNT]: 12,
    [ATTEMPTS]: 40
  },
  MEDIUM: {
    [COLOR]: '--vt-yellow',
    [NAME]: 'Medium',
    ...calculateQuantities(24)
  },
  HARD: {
    [COLOR]: '--vt-orange',
    [NAME]: 'Hard',
    ...calculateQuantities(36)
  },
  INSANE: {
    [COLOR]: '--vt-orange-dark',
    [NAME]: 'Insane',
    ...calculateQuantities(48)
  },
  SURVIVAL: {
    [COLOR]: '--vt-red',
    [NAME]: 'Survival',
    ...calculateQuantities(EMOJI_LIST.length)
  }
} as const
