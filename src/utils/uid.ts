const START_INDEX = 2
export const UID_LENGTH = 9

export const uid = (): string =>
  Math.random()
    .toString(36)
    .slice(START_INDEX, UID_LENGTH + START_INDEX)
