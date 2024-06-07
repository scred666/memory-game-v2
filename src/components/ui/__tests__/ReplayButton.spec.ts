import { mount } from '@vue/test-utils'
import { isUndefined } from 'lodash-es'
import { describe, it, expect } from 'vitest'
import type { ComponentPublicInstance } from 'vue'

import { extendedWrapper, type ExtendedVueWrapper } from '@/utils/vitest.js'

import ReplayButton from '@/components/ui/ReplayButton.vue'
import { APP_TEST_IDS } from '@/utils/tests-helpers'

const createComponent = ({
  disabled = false,
  slotContent
}: {
  disabled?: boolean
  slotContent?: string
} = {}): ExtendedVueWrapper => {
  if (!isUndefined(slotContent)) {
    return extendedWrapper(
      mount(ReplayButton, {
        propsData: {
          disabled
        },
        slots: {
          default: slotContent
        }
      })
    )
  }

  return extendedWrapper(
    mount(ReplayButton, {
      propsData: {
        disabled
      }
    })
  )
}

type ReplayButtonInstance = ComponentPublicInstance<{
  onClick: () => void
}>

describe('ReplayButton', () => {
  it('renders properly', () => {
    const wrapper: ExtendedVueWrapper = createComponent()

    expect(wrapper.exists()).toBeTruthy()
  })

  it('should render with default text content if slot is not provided', () => {
    const wrapper: ExtendedVueWrapper = createComponent()

    expect(wrapper.findByTestId(APP_TEST_IDS.REPLAY_BUTTON).text()).toBe('New Game')
  })

  it('should render with provided text content', () => {
    const slotContent = 'Test content'
    const wrapper: ExtendedVueWrapper = createComponent({
      slotContent
    })

    expect(wrapper.findByTestId(APP_TEST_IDS.REPLAY_BUTTON).text()).toBe(slotContent)
  })

  it('should emit replay click event', async () => {
    const wrapper: ExtendedVueWrapper = createComponent()

    wrapper.findComponentByTestId(APP_TEST_IDS.REPLAY_BUTTON).trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted<'click'>()!['click']).toHaveLength(1)

    wrapper.findComponentByTestId(APP_TEST_IDS.REPLAY_BUTTON).trigger('click')
    wrapper.findComponentByTestId(APP_TEST_IDS.REPLAY_BUTTON).trigger('click')
    wrapper.findComponentByTestId(APP_TEST_IDS.REPLAY_BUTTON).trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted<'click'>()!['click']).toHaveLength(4)
  })

  it(`shouldn't emit click event if button is disabled`, async () => {
    const wrapper: ExtendedVueWrapper = createComponent({ disabled: true })

    wrapper.findComponentByTestId(APP_TEST_IDS.REPLAY_BUTTON).trigger('click')
    await wrapper.vm.$nextTick()

    const emitted = wrapper.emitted<'click'>()
    expect(emitted?.['click']).toBeUndefined()
  })

  it(`shouldn't emit click event if button is disabled but user remove disabled attr from inspector`, async () => {
    const wrapper: ExtendedVueWrapper = createComponent({ disabled: true })
    const vm = wrapper.vm as ReplayButtonInstance

    vm.onClick()
    await wrapper.vm.$nextTick()

    const emitted = wrapper.emitted<'click'>()
    expect(emitted?.['click']).toBeUndefined()
  })
})
