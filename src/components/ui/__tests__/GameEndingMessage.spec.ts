import { mount } from '@vue/test-utils'
import { isUndefined } from 'lodash-es'
import { describe, it, expect } from 'vitest'

import { extendedWrapper, type ExtendedVueWrapper } from '@/utils/vitest.js'

import GameEndingMessage from '@/components/ui/GameEndingMessage.vue'
import { APP_TEST_IDS } from '@/utils/tests-helpers'

const createComponent = ({
  slotContent
}: {
  slotContent?: string
} = {}): ExtendedVueWrapper => {
  if (!isUndefined(slotContent)) {
    return extendedWrapper(
      mount(GameEndingMessage, {
        slots: {
          default: slotContent
        }
      })
    )
  }

  return extendedWrapper(mount(GameEndingMessage))
}

describe('GameEndingMessage', () => {
  it('renders properly', () => {
    const wrapper: ExtendedVueWrapper = createComponent()

    expect(wrapper.exists()).toBeTruthy()
  })

  it('should render with default text content if slot is not provided', () => {
    const wrapper: ExtendedVueWrapper = createComponent()

    expect(wrapper.text()).toContain('Congratulations')
  })

  it('should render with provided text content', () => {
    const slotContent = 'Test content'
    const wrapper: ExtendedVueWrapper = createComponent({
      slotContent
    })

    expect(wrapper.text()).toContain(slotContent)
  })

  it('should render with ReplayButton', () => {
    const wrapper: ExtendedVueWrapper = createComponent()

    expect(wrapper.findComponentByTestId(APP_TEST_IDS.REPLAY_BUTTON).exists()).toBeTruthy()
  })

  it('should emit replay event on ReplayButton click', () => {
    const wrapper: ExtendedVueWrapper = createComponent()
    wrapper.getComponentByTestId(APP_TEST_IDS.REPLAY_BUTTON).trigger('click')

    expect(wrapper.emitted<'replay'>()!['replay']).toHaveLength(1)
  })
})
