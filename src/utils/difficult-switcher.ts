import { EMOJI_LIST } from '@/utils/emoji'

export enum DIFFICULTY_KEYS {
  COLOR = 'color',
  COUNT = 'count',
  NAME = 'name'
}

const { COLOR, COUNT, NAME } = DIFFICULTY_KEYS

export interface Difficult {
  [COLOR]: string
  [COUNT]: number
  [NAME]: string
}

export const DIFFICULTIES: Record<string, Difficult> = {
  EASY: {
    [COLOR]: '--vt-green',
    [COUNT]: 12,
    [NAME]: 'Easy'
  },
  MEDIUM: {
    [COLOR]: '--vt-yellow',
    [COUNT]: 24,
    [NAME]: 'Medium'
  },
  HARD: {
    [COLOR]: '--vt-orange',
    [COUNT]: 36,
    [NAME]: 'Hard'
  },
  INSANE: {
    [COLOR]: '--vt-orange-dark',
    [COUNT]: 48,
    [NAME]: 'Insane'
  },
  SURVIVAL: {
    [COLOR]: '--vt-red',
    [COUNT]: EMOJI_LIST.length,
    [NAME]: 'Survival'
  }
}
