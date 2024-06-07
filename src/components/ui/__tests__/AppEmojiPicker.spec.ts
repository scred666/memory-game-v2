import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, test, type SpyInstance } from 'vitest'
import { type ComponentPublicInstance } from 'vue'

import { extendedWrapper, type ExtendedVueWrapper } from '@/utils/vitest.js'

import AppEmojiPicker from '@/components/ui/AppEmojiPicker.vue'
import DifficultSwitcher from '@/components/ui/DifficultSwitcher.vue'
import { type Difficult, DIFFICULTIES, DIFFICULTY_KEYS } from '@/utils/difficult-switcher'
import { shuffleArray } from '@/utils/helpers'
import * as helpers from '@/utils/helpers'
import { roundUp } from '@/utils/round-up'
import { APP_TEST_IDS } from '@/utils/tests-helpers'

const createComponent = (
  {
    currentDifficult
  }: {
    currentDifficult: Difficult
  } = {
    currentDifficult: DIFFICULTIES.EASY
  }
): ExtendedVueWrapper => {
  return extendedWrapper(
    mount(AppEmojiPicker, {
      propsData: {
        currentDifficult
      }
    })
  )
}

describe('AppEmojiPicker', () => {
  it('renders properly', () => {
    const wrapper: ExtendedVueWrapper = createComponent()

    expect(wrapper.findByTestId(APP_TEST_IDS.EMOJI_PICKER).exists()).toBeTruthy()
    expect(wrapper.findByTestId(APP_TEST_IDS.EMOJI_PICKER_SOLVED_COUNTER).exists()).toBeTruthy()
    expect(wrapper.findByTestId(APP_TEST_IDS.EMOJI_PICKER_ATTEMPTS_COUNTER).exists()).toBeTruthy()
    expect(wrapper.findByTestId(APP_TEST_IDS.WIN_MESSAGE).exists()).toBeFalsy()
    expect(wrapper.findByTestId(APP_TEST_IDS.LOSE_MESSAGE).exists()).toBeFalsy()
    expect(wrapper.findByTestId(APP_TEST_IDS.REPLAY_BUTTON).exists()).toBeTruthy()
    expect(wrapper.exists()).toBeTruthy()
  })

  it('renders correctly for each difficulty', () => {
    Object.values(DIFFICULTIES).forEach(difficulty => {
      const wrapper: ExtendedVueWrapper = createComponent({
        currentDifficult: difficulty
      })

      expect(wrapper.findAllByTestId(APP_TEST_IDS.EMOJI_ITEM_LABEL)).toHaveLength(
        difficulty[DIFFICULTY_KEYS.COUNT] * 2
      )
      expect(wrapper.findAllByTestId(APP_TEST_IDS.EMOJI_ITEM_INPUT)).toHaveLength(
        difficulty[DIFFICULTY_KEYS.COUNT] * 2
      )
      expect(wrapper.findByTestId(APP_TEST_IDS.EMOJI_PICKER_SOLVED_COUNTER).text()).toBe(
        `0 / ${difficulty[DIFFICULTY_KEYS.COUNT]}`
      )
      expect(wrapper.findByTestId(APP_TEST_IDS.EMOJI_PICKER_ATTEMPTS_COUNTER).text()).toBe(
        difficulty[DIFFICULTY_KEYS.ATTEMPTS].toString()
      )
    })
  })

  type AppEmojiItemInstance = ComponentPublicInstance<{
    usedAttempts: number
    selectedItems: string[]
    solvedItems: string[]
    availableAttempts: number
    isGameWin: boolean
    isGameLose: boolean
  }>

  const TOTAL_COUNT = DIFFICULTIES.EASY[DIFFICULTY_KEYS.COUNT] as number
  const ATTEMPTS_COUNT = DIFFICULTIES.EASY[DIFFICULTY_KEYS.ATTEMPTS] as number

  const createSetTimeoutSpy = (): SpyInstance => {
    return vi.spyOn(window, 'setTimeout').mockImplementation((fn: Function) => fn())
  }

  const createShuffleArrayWithoutChangesSpy = (): SpyInstance => {
    // use spread operator to avoid mutation of original array
    return vi.spyOn(helpers, 'shuffleArray').mockImplementation(<T>(arr: T[]): T[] => [...arr])
  }

  const createPseudoShuffleArraySpy = (): SpyInstance => {
    // use spread operator to avoid mutation of original array
    return vi.spyOn(helpers, 'shuffleArray').mockImplementation(<T>(arr: T[]): T[] => {
      const clone = [...arr]
      ;[clone[1], clone[2]] = [clone[2], clone[1]]
      return clone
    })
  }

  const pickEmojiByIndex = ({
    index,
    wrapper
  }: {
    index: number
    wrapper: ExtendedVueWrapper
  }): void => {
    wrapper.findAllByTestId(APP_TEST_IDS.EMOJI_ITEM_INPUT).at(index).setChecked()
  }

  describe('toolbar items', () => {
    it('should show correct value on counters and replay button state with solving', async () => {
      const shuffleArrayWithoutChangesSpy = createShuffleArrayWithoutChangesSpy()
      const wrapper: ExtendedVueWrapper = createComponent()
      const vm = wrapper.vm as AppEmojiItemInstance

      expect(wrapper.findByTestId(APP_TEST_IDS.EMOJI_PICKER_SOLVED_COUNTER).text()).toBe(
        `0 / ${TOTAL_COUNT}`
      )
      expect(wrapper.findByTestId(APP_TEST_IDS.EMOJI_PICKER_ATTEMPTS_COUNTER).text()).toBe(
        ATTEMPTS_COUNT.toString()
      )
      expect(vm.usedAttempts).toBe(0)
      expect(vm.selectedItems).toHaveLength(0)
      expect(vm.solvedItems).toHaveLength(0)
      expect(wrapper.findComponentByTestId(APP_TEST_IDS.REPLAY_BUTTON).props('disabled')).toBe(true)

      pickEmojiByIndex({ index: 0, wrapper })
      expect(vm.selectedItems).toHaveLength(1)
      expect(wrapper.findComponentByTestId(APP_TEST_IDS.REPLAY_BUTTON).props('disabled')).toBe(true)
      await wrapper.vm.$nextTick()

      pickEmojiByIndex({ index: 1, wrapper })
      expect(vm.selectedItems).toHaveLength(2)
      await wrapper.vm.$nextTick()

      expect(wrapper.findByTestId(APP_TEST_IDS.EMOJI_PICKER_SOLVED_COUNTER).text()).toBe(
        `1 / ${TOTAL_COUNT}`
      )
      expect(wrapper.findByTestId(APP_TEST_IDS.EMOJI_PICKER_ATTEMPTS_COUNTER).text()).toBe(
        (ATTEMPTS_COUNT - 1).toString()
      )
      expect(wrapper.findComponentByTestId(APP_TEST_IDS.REPLAY_BUTTON).props('disabled')).toBe(
        false
      )
      expect(vm.usedAttempts).toBe(1)
      expect(vm.selectedItems).toHaveLength(0)
      expect(vm.solvedItems).toHaveLength(1)

      pickEmojiByIndex({ index: 2, wrapper })
      expect(vm.selectedItems).toHaveLength(1)
      await wrapper.vm.$nextTick()
      pickEmojiByIndex({ index: 3, wrapper })
      expect(vm.selectedItems).toHaveLength(2)
      await wrapper.vm.$nextTick()

      expect(wrapper.findByTestId(APP_TEST_IDS.EMOJI_PICKER_SOLVED_COUNTER).text()).toBe(
        `2 / ${TOTAL_COUNT}`
      )
      expect(wrapper.findByTestId(APP_TEST_IDS.EMOJI_PICKER_ATTEMPTS_COUNTER).text()).toBe(
        (ATTEMPTS_COUNT - 2).toString()
      )
      expect(vm.usedAttempts).toBe(2)
      expect(vm.selectedItems).toHaveLength(0)
      expect(vm.solvedItems).toHaveLength(2)

      shuffleArrayWithoutChangesSpy.mockRestore()
    })

    it('should show correct value on counters and replay button state with wrong choices', async () => {
      const pseudoShuffleArraySpy = createPseudoShuffleArraySpy()
      const setTimeoutSpy = createSetTimeoutSpy()

      const wrapper: ExtendedVueWrapper = createComponent()
      const vm = wrapper.vm as AppEmojiItemInstance

      expect(wrapper.findByTestId(APP_TEST_IDS.EMOJI_PICKER_SOLVED_COUNTER).text()).toBe(
        `0 / ${TOTAL_COUNT}`
      )
      expect(wrapper.findByTestId(APP_TEST_IDS.EMOJI_PICKER_ATTEMPTS_COUNTER).text()).toBe(
        ATTEMPTS_COUNT.toString()
      )
      expect(vm.usedAttempts).toBe(0)
      expect(vm.selectedItems).toHaveLength(0)
      expect(vm.solvedItems).toHaveLength(0)
      expect(wrapper.findComponentByTestId(APP_TEST_IDS.REPLAY_BUTTON).props('disabled')).toBe(true)

      pickEmojiByIndex({ index: 0, wrapper })
      expect(vm.selectedItems).toHaveLength(1)
      expect(wrapper.findComponentByTestId(APP_TEST_IDS.REPLAY_BUTTON).props('disabled')).toBe(true)
      await wrapper.vm.$nextTick()

      pickEmojiByIndex({ index: 1, wrapper })
      expect(vm.selectedItems).toHaveLength(2)
      await wrapper.vm.$nextTick()

      expect(wrapper.findByTestId(APP_TEST_IDS.EMOJI_PICKER_SOLVED_COUNTER).text()).toBe(
        `0 / ${TOTAL_COUNT}`
      )
      expect(wrapper.findByTestId(APP_TEST_IDS.EMOJI_PICKER_ATTEMPTS_COUNTER).text()).toBe(
        (ATTEMPTS_COUNT - 1).toString()
      )
      await wrapper.vm.$nextTick()

      expect(wrapper.findComponentByTestId(APP_TEST_IDS.REPLAY_BUTTON).props('disabled')).toBe(true)
      expect(vm.usedAttempts).toBe(1)
      expect(vm.selectedItems).toHaveLength(0)
      expect(vm.solvedItems).toHaveLength(0)

      pickEmojiByIndex({ index: 2, wrapper })
      expect(vm.selectedItems).toHaveLength(1)
      await wrapper.vm.$nextTick()
      pickEmojiByIndex({ index: 3, wrapper })
      expect(vm.selectedItems).toHaveLength(2)
      await wrapper.vm.$nextTick()

      expect(wrapper.findByTestId(APP_TEST_IDS.EMOJI_PICKER_SOLVED_COUNTER).text()).toBe(
        `0 / ${TOTAL_COUNT}`
      )
      expect(wrapper.findByTestId(APP_TEST_IDS.EMOJI_PICKER_ATTEMPTS_COUNTER).text()).toBe(
        (ATTEMPTS_COUNT - 2).toString()
      )
      expect(wrapper.findComponentByTestId(APP_TEST_IDS.REPLAY_BUTTON).props('disabled')).toBe(true)
      expect(vm.usedAttempts).toBe(2)
      expect(vm.selectedItems).toHaveLength(0)
      expect(vm.solvedItems).toHaveLength(0)

      pseudoShuffleArraySpy.mockRestore()
      setTimeoutSpy.mockRestore()
    })
  })

  describe('ending messages', () => {
    it('should show win message', async () => {
      const shuffleArrayWithoutChangesSpy = createShuffleArrayWithoutChangesSpy()
      const wrapper: ExtendedVueWrapper = createComponent()
      const setTimeoutSpy = createSetTimeoutSpy()

      expect(wrapper.findByTestId(APP_TEST_IDS.WIN_MESSAGE).exists()).toBeFalsy()
      expect(wrapper.findByTestId(APP_TEST_IDS.LOSE_MESSAGE).exists()).toBeFalsy()

      for (let i: number = 0; i < (TOTAL_COUNT - 1) * 2; i += 2) {
        pickEmojiByIndex({ index: i, wrapper })
        await wrapper.vm.$nextTick()
        pickEmojiByIndex({ index: i + 1, wrapper })
        await wrapper.vm.$nextTick()
      }

      expect(wrapper.findByTestId(APP_TEST_IDS.WIN_MESSAGE).exists()).toBeFalsy()
      expect(wrapper.findByTestId(APP_TEST_IDS.LOSE_MESSAGE).exists()).toBeFalsy()

      pickEmojiByIndex({ index: TOTAL_COUNT * 2 - 2, wrapper })
      await wrapper.vm.$nextTick()
      pickEmojiByIndex({ index: TOTAL_COUNT * 2 - 1, wrapper })
      await wrapper.vm.$nextTick()

      expect(wrapper.findByTestId(APP_TEST_IDS.WIN_MESSAGE).exists()).toBeTruthy()
      expect(wrapper.findByTestId(APP_TEST_IDS.LOSE_MESSAGE).exists()).toBeFalsy()
      shuffleArrayWithoutChangesSpy.mockRestore()
      setTimeoutSpy.mockRestore()
    })

    it('should show lose message', async () => {
      const pseudoShuffleArraySpy = createPseudoShuffleArraySpy()
      const setTimeoutSpy = createSetTimeoutSpy()

      const wrapper: ExtendedVueWrapper = createComponent()

      expect(wrapper.findByTestId(APP_TEST_IDS.WIN_MESSAGE).exists()).toBeFalsy()
      expect(wrapper.findByTestId(APP_TEST_IDS.LOSE_MESSAGE).exists()).toBeFalsy()

      for (let i: number = 0; i < ATTEMPTS_COUNT; i += 1) {
        pickEmojiByIndex({ index: 0, wrapper })
        await wrapper.vm.$nextTick()

        pickEmojiByIndex({ index: 1, wrapper })
        await wrapper.vm.$nextTick()
      }

      await wrapper.vm.$nextTick()

      expect(wrapper.findByTestId(APP_TEST_IDS.WIN_MESSAGE).exists()).toBeFalsy()
      expect(wrapper.findByTestId(APP_TEST_IDS.LOSE_MESSAGE).exists()).toBeTruthy()

      pseudoShuffleArraySpy.mockRestore()
      setTimeoutSpy.mockRestore()
    })

    it('should show win message instead of lose message if user solve last pair by last attempt', async () => {
      const shuffleArrayWithoutChangesSpy = createShuffleArrayWithoutChangesSpy()
      const wrapper: ExtendedVueWrapper = createComponent()
      const setTimeoutSpy = createSetTimeoutSpy()
      const vm = wrapper.vm as AppEmojiItemInstance

      expect(wrapper.findByTestId(APP_TEST_IDS.WIN_MESSAGE).exists()).toBeFalsy()
      expect(wrapper.findByTestId(APP_TEST_IDS.LOSE_MESSAGE).exists()).toBeFalsy()

      const REST_EMOJI_ITEMS_COUNT = 2 as const

      const EMOJI_ITEMS_FOR_INSTANT_SOLVE: number = (TOTAL_COUNT - REST_EMOJI_ITEMS_COUNT) * 2

      // solve first 10 pairs instantly
      for (let i: number = 0; i < EMOJI_ITEMS_FOR_INSTANT_SOLVE; i += 2) {
        pickEmojiByIndex({ index: i, wrapper })
        await wrapper.vm.$nextTick()
        pickEmojiByIndex({ index: i + 1, wrapper })
        await wrapper.vm.$nextTick()
      }

      // do mistakes until last attempt
      for (let i: number = 0; i < vm.availableAttempts - 2; i += 1) {
        pickEmojiByIndex({ index: TOTAL_COUNT * 2 - 4, wrapper })
        await wrapper.vm.$nextTick()
        pickEmojiByIndex({ index: TOTAL_COUNT * 2 - 2, wrapper })
        await wrapper.vm.$nextTick()
      }

      // solve rest 2 pairs
      for (let i: number = REST_EMOJI_ITEMS_COUNT * 2; i > 0; i -= 1) {
        pickEmojiByIndex({ index: TOTAL_COUNT * 2 - i, wrapper })
        await wrapper.vm.$nextTick()
      }

      expect(wrapper.findByTestId(APP_TEST_IDS.WIN_MESSAGE).exists()).toBeTruthy()
      expect(wrapper.findByTestId(APP_TEST_IDS.LOSE_MESSAGE).exists()).toBeFalsy()
      shuffleArrayWithoutChangesSpy.mockRestore()
      setTimeoutSpy.mockRestore()
    })
  })

  it('replay button should reset game state', async () => {
    const setTimeoutSpy = createSetTimeoutSpy()
    const shuffleArrayWithoutChangesSpy = createShuffleArrayWithoutChangesSpy()
    const wrapper: ExtendedVueWrapper = createComponent()
    const vm = wrapper.vm as AppEmojiItemInstance

    pickEmojiByIndex({ index: 0, wrapper })
    await wrapper.vm.$nextTick()
    pickEmojiByIndex({ index: 1, wrapper })
    await wrapper.vm.$nextTick()

    expect(vm.usedAttempts).toBe(1)
    expect(vm.solvedItems).toHaveLength(1)

    wrapper.findComponentByTestId(APP_TEST_IDS.REPLAY_BUTTON).trigger('click')

    await wrapper.vm.$nextTick()

    expect(vm.usedAttempts).toBe(0)
    expect(vm.solvedItems).toHaveLength(0)

    shuffleArrayWithoutChangesSpy.mockRestore()
    setTimeoutSpy.mockRestore()
  })

  it('state rests automatically on difficult change', async () => {
    const setTimeoutSpy = createSetTimeoutSpy()
    const shuffleArrayWithoutChangesSpy = createShuffleArrayWithoutChangesSpy()
    const wrapper: ExtendedVueWrapper = createComponent()
    const vm = wrapper.vm as AppEmojiItemInstance

    pickEmojiByIndex({ index: 0, wrapper })
    await wrapper.vm.$nextTick()
    pickEmojiByIndex({ index: 1, wrapper })
    await wrapper.vm.$nextTick()

    expect(vm.usedAttempts).toBe(1)
    expect(vm.solvedItems).toHaveLength(1)

    wrapper.setProps({ currentDifficult: DIFFICULTIES.MEDIUM })

    await wrapper.vm.$nextTick()

    expect(vm.usedAttempts).toBe(0)
    expect(vm.solvedItems).toHaveLength(0)

    shuffleArrayWithoutChangesSpy.mockRestore()
    setTimeoutSpy.mockRestore()
  })
})
