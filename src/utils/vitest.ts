import { VueWrapper } from '@vue/test-utils'
import { isEmpty } from 'lodash-es'

export interface ExtendedVueWrapper extends VueWrapper {
  findAllByTestId(id: string): Array<any>

  findAllComponentsByTestId(id: string): Array<any>

  findByTestId(id: string): any

  findComponentByTestId(id: string): any

  findDeepByByTestId(idChain: Array<string>): any

  getByTestId(id: string): any

  getComponentByTestId(id: string): any
}

export const extendedWrapper = (wrapper: VueWrapper): ExtendedVueWrapper => {
  return Object.defineProperties(wrapper, {
    getByTestId: {
      value(id: string) {
        return this.get(`[data-test-id="${id}"]`)
      }
    },
    getComponentByTestId: {
      value(id: string) {
        return this.getComponent(`[data-test-id="${id}"]`)
      }
    },
    findByTestId: {
      value(id: string) {
        return this.find(`[data-test-id="${id}"]`)
      }
    },
    findComponentByTestId: {
      value(id: string) {
        return this.findComponent(`[data-test-id="${id}"]`)
      }
    },
    findAllByTestId: {
      value(id: string) {
        return this.findAll(`[data-test-id="${id}"]`)
      }
    },
    findAllComponentsByTestId: {
      value(id: string) {
        return this.findAllComponents(`[data-testid="${id}"]`)
      }
    },
    findDeepByByTestId: {
      value(idChain: Array<string> = []) {
        if (!Array.isArray(idChain) || isEmpty(idChain)) {
          throw new Error('idChain should be an array of test ids in order of nesting')
        }

        const selectorsChain = idChain.map(id => `[data-test-id="${id}"]`).join(' ')
        return this.find(selectorsChain)
      }
    }
  }) as ExtendedVueWrapper
}

export const TEST_CASES_KEYS = {
  VALUE: 'value',
  EXPECTED: 'expected'
} as const
