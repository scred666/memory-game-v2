import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, test } from 'vitest'
import { type ComponentPublicInstance } from 'vue'

import { extendedWrapper, type ExtendedVueWrapper } from '@/utils/vitest.js'

import DifficultSwitcher from '@/components/ui/DifficultSwitcher.vue'
import { DIFFICULTIES, DIFFICULTY_KEYS } from '@/utils/difficult-switcher'
import { APP_TEST_IDS } from '@/utils/tests-helpers'

interface CreateComponentOptions {
  modelValue?: string
}

const createComponent = ({
  modelValue = DIFFICULTIES.EASY[DIFFICULTY_KEYS.NAME]
}: CreateComponentOptions = {}): ExtendedVueWrapper => {
  return extendedWrapper(
    mount(DifficultSwitcher, {
      propsData: {
        modelValue
      }
    })
  )
}

describe('DifficultSwitcher', () => {
  it('renders properly', () => {
    const wrapper: ExtendedVueWrapper = createComponent()

    expect(wrapper.exists()).toBeTruthy()
  })

  it('renders correct count of difficulty buttons', () => {
    const wrapper: ExtendedVueWrapper = createComponent()

    expect(wrapper.findAllByTestId(APP_TEST_IDS.DIFFICULT_SWITCHER_INPUT)).toHaveLength(
      Object.keys(DIFFICULTIES).length
    )
    expect(wrapper.findAllByTestId(APP_TEST_IDS.DIFFICULT_SWITCHER_LABEL)).toHaveLength(
      Object.keys(DIFFICULTIES).length
    )
  })

  const validModelValueCases: string[] = Object.values(DIFFICULTIES).map(
    difficulty => difficulty[DIFFICULTY_KEYS.NAME]
  )

  type DifficultSwitcherInstance = ComponentPublicInstance<{
    localValue: string
  }>

  test.each(validModelValueCases)(
    `set localValue correctly for modalValue %j`,
    (testCase: string) => {
      const spy = vi.spyOn(console, 'warn')
      const wrapper: ExtendedVueWrapper = createComponent({
        modelValue: testCase
      })

      const vm = wrapper.vm as DifficultSwitcherInstance

      expect(vm.localValue).toBe(testCase)
      expect(spy).not.toHaveBeenCalled()

      spy.mockRestore()
    }
  )

  const invalidModelValueCases: any[] = [
    0,
    17,
    Infinity,
    -Infinity,
    -1,
    1.5,
    'a',
    '1,5',
    null,
    NaN,
    {},
    [],
    () => {}
  ]

  test.each(invalidModelValueCases)(
    'should fail prop validator for modelValue %j',
    (testCase: any) => {
      const spy = vi.spyOn(console, 'warn')

      createComponent({
        modelValue: testCase
      })

      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy.mock.calls[0]).toEqual(
        expect.arrayContaining([expect.stringContaining('[Vue warn]: Invalid prop: ')])
      )

      spy.mockRestore()
    }
  )

  interface EmitTestCase {
    testCase: string
    index: number
  }

  const emitTestCases = validModelValueCases
    .map((testCase: string, index: number) => {
      return {
        testCase,
        index
      }
    })
    .reverse() as EmitTestCase[]

  it('should emit `update:model-value` with for each button correctly', () => {
    const wrapper: ExtendedVueWrapper = createComponent()

    const inputs = wrapper.findAllByTestId(APP_TEST_IDS.DIFFICULT_SWITCHER_INPUT)

    emitTestCases.forEach(({ testCase, index }, loopIndex) => {
      inputs.at(index)!.trigger('change')

      expect(wrapper.emitted<'update:model-value'>()!['update:model-value']).toHaveLength(
        loopIndex + 1
      )
      expect(wrapper.emitted<'update:model-value'>()!['update:model-value'][loopIndex][0]).toBe(
        testCase
      )
    })
  })

  it('createId() works correctly', () => {
    const wrapper: ExtendedVueWrapper = createComponent()

    const inputs = wrapper.findAllByTestId(APP_TEST_IDS.DIFFICULT_SWITCHER_INPUT)

    inputs.forEach((input, index) => {
      expect(input.attributes('id')).toBe(
        `difficult-${Object.values(DIFFICULTIES)[index][DIFFICULTY_KEYS.NAME]}`
      )
    })
  })
})
