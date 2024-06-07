import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'

import { extendedWrapper, type ExtendedVueWrapper } from '@/utils/vitest.js'

import AppEmojiItem from '@/components/ui/AppEmojiItem.vue'
import { EMOJI_ITEM_KEYS, type EmojiItem } from '@/utils/emoji'
import { APP_TEST_IDS } from '@/utils/tests-helpers'

const { EMOJI, PUBLIC_ID, PRIVATE_ID } = EMOJI_ITEM_KEYS

const TEST_EMOJI_ITEM: EmojiItem = {
  [EMOJI]: '!',
  [PUBLIC_ID]: 'test-publicId',
  [PRIVATE_ID]: 'test-privateId'
} as const

const createComponent = ({
  item = TEST_EMOJI_ITEM,
  isDisabled = false,
  modelValue = [],
  isSolved = false
}: Partial<{
  item: EmojiItem
  isDisabled: boolean
  modelValue: string[]
  isSolved: boolean
}> = {}): ExtendedVueWrapper => {
  return extendedWrapper(
    mount(AppEmojiItem, {
      propsData: {
        item,
        isDisabled,
        modelValue,
        isSolved
      }
    })
  )
}

describe('AppEmojiItem', () => {
  it('renders properly', () => {
    const wrapper: ExtendedVueWrapper = createComponent()

    expect(wrapper.exists()).toBeTruthy()
  })

  it('emoji is not shown by default', () => {
    const wrapper: ExtendedVueWrapper = createComponent()

    expect(wrapper.findComponentByTestId(APP_TEST_IDS.EMOJI_ITEM_LABEL).text()).toBe('')
  })

  it('emoji is show for solved item', () => {
    const wrapper: ExtendedVueWrapper = createComponent({ isSolved: true })

    expect(wrapper.findComponentByTestId(APP_TEST_IDS.EMOJI_ITEM_LABEL).text()).toBe(
      TEST_EMOJI_ITEM[EMOJI]
    )
  })

  it('emoji is show for active item', () => {
    const wrapper: ExtendedVueWrapper = createComponent({
      modelValue: [
        'a',
        'b',
        'c',
        'd',
        'e',
        'f',
        TEST_EMOJI_ITEM[PUBLIC_ID],
        'q',
        'r',
        's',
        't',
        'u',
        'v',
        'w',
        'x',
        'y',
        'z'
      ]
    })

    expect(wrapper.findComponentByTestId(APP_TEST_IDS.EMOJI_ITEM_LABEL).text()).toBe(
      TEST_EMOJI_ITEM[EMOJI]
    )
  })

  it('should emit correct event on click', () => {
    const wrapper: ExtendedVueWrapper = createComponent()

    wrapper.findByTestId(APP_TEST_IDS.EMOJI_ITEM_INPUT).setChecked()

    expect(wrapper.emitted<'update:model-value'>()!['update:model-value']).toHaveLength(1)
    expect(wrapper.emitted<'update:model-value'>()!['update:model-value'][0][0]).toEqual(
      expect.arrayContaining([TEST_EMOJI_ITEM[PUBLIC_ID]])
    )
  })

  it(`shouldn't emit event on click if item is disabled`, () => {
    const wrapper: ExtendedVueWrapper = createComponent({ isDisabled: true })

    wrapper.findByTestId(APP_TEST_IDS.EMOJI_ITEM_INPUT).setChecked()
    const emitted = wrapper.emitted<'update:model-value'>()

    expect(emitted?.['update:model-value']).toBeUndefined()
  })
})
