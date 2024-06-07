import { describe, expect, test } from 'vitest'

import { roundUp, type RoundUpOptions } from '@/utils/round-up'
import { TEST_CASES_KEYS } from '@/utils/vitest'

const { VALUE, EXPECTED } = TEST_CASES_KEYS

interface TestRoundUpOptions extends RoundUpOptions {
  [EXPECTED]: number
}

const COMMON_VALUE: number = 12345

const MULTIPLIER = 'multiplier'

describe('roundUp()', () => {
  const testCases: TestRoundUpOptions[] = [
    {
      [VALUE]: 1,
      [EXPECTED]: 50
    },
    {
      [VALUE]: 1,
      [MULTIPLIER]: 5,
      [EXPECTED]: 5
    },
    {
      [VALUE]: 10,
      [EXPECTED]: 50
    },
    {
      [VALUE]: 10,
      [MULTIPLIER]: 5,
      [EXPECTED]: 10
    },
    {
      [VALUE]: 11,
      [EXPECTED]: 50
    },
    {
      [VALUE]: 11,
      [MULTIPLIER]: 5,
      [EXPECTED]: 15
    },
    {
      [VALUE]: 25,
      [EXPECTED]: 50
    },
    {
      [VALUE]: 26,
      [EXPECTED]: 50
    },
    {
      [VALUE]: 50,
      [EXPECTED]: 50
    },
    {
      [VALUE]: 51,
      [EXPECTED]: 100
    },
    {
      [VALUE]: 100,
      [EXPECTED]: 100
    },
    {
      [VALUE]: 101,
      [EXPECTED]: 150
    },
    {
      [VALUE]: 100,
      [MULTIPLIER]: 5,
      [EXPECTED]: 100
    },
    {
      [VALUE]: COMMON_VALUE,
      [MULTIPLIER]: 0,
      [EXPECTED]: COMMON_VALUE
    },
    {
      [VALUE]: COMMON_VALUE,
      [MULTIPLIER]: -1,
      [EXPECTED]: COMMON_VALUE
    },
    {
      [VALUE]: COMMON_VALUE,
      [MULTIPLIER]: 1.1,
      [EXPECTED]: COMMON_VALUE
    },
    {
      [VALUE]: COMMON_VALUE,
      [MULTIPLIER]: NaN,
      [EXPECTED]: COMMON_VALUE
    },
    {
      [VALUE]: COMMON_VALUE,
      [MULTIPLIER]: Infinity,
      [EXPECTED]: COMMON_VALUE
    },
    {
      [VALUE]: COMMON_VALUE,
      [MULTIPLIER]: -Infinity,
      [EXPECTED]: COMMON_VALUE
    },

    {
      [VALUE]: COMMON_VALUE,
      [MULTIPLIER]: 0.5,
      [EXPECTED]: COMMON_VALUE
    },

    {
      [VALUE]: Infinity,
      [EXPECTED]: Infinity
    },

    {
      [VALUE]: -Infinity,
      [EXPECTED]: -Infinity
    },

    {
      [VALUE]: Infinity,
      [MULTIPLIER]: 100,
      [EXPECTED]: Infinity
    }
  ]

  test.each(testCases)(`works correctly for [VALUE]: $value`, ({ value, expected, multiplier }) => {
    expect(roundUp({ value, multiplier })).toBe(expected)
  })
})
