import { describe, it, expect, vi } from 'vitest'

import { uid } from '@/utils/uid.js'

describe('uid()', () => {
  it('works correctly', () => {
    const spy = vi.spyOn(Math, 'random').mockReturnValue(0.1366613)
    expect(uid()).toBe('4x42i7urt')
    spy.mockRestore()
  })

  it('generates unique id', () => {
    expect(uid()).not.toBe(uid())
  })

  it('generated id length is correct', () => {
    expect(uid()).toHaveLength(9)
  })

  it('generates unique id every time', () => {
    const collection = new Set()

    const COUNT = 1e4

    for (let i = 0; i < COUNT; i += 1) {
      collection.add(uid())
    }

    expect(collection.size).toBe(COUNT)
  })
})
