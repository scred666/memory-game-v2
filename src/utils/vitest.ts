import { VueWrapper } from '@vue/test-utils'
import { isEmpty } from 'lodash-es'

import type { APP_TEST_IDS } from '@/utils/tests-helpers'

type TestId = (typeof APP_TEST_IDS)[keyof typeof APP_TEST_IDS]

export interface ExtendedVueWrapper extends VueWrapper {
  findAllByTestId(id: TestId): Array<any>

  findAllComponentsByTestId(id: TestId): Array<any>

  findByTestId(id: TestId): any

  findComponentByTestId(id: TestId): any

  findDeepByByTestId(idChain: Array<TestId>): any

  getByTestId(id: TestId): any

  getComponentByTestId(id: TestId): any
}

const createTestIdSelector = (id: TestId): `[data-test-id="${TestId}"]` => `[data-test-id="${id}"]`

export const extendedWrapper = (wrapper: VueWrapper): ExtendedVueWrapper => {
  return Object.defineProperties(wrapper, {
    getByTestId: {
      value(id: TestId) {
        return this.get(createTestIdSelector(id))
      }
    },
    getComponentByTestId: {
      value(id: TestId) {
        return this.getComponent(createTestIdSelector(id))
      }
    },
    findByTestId: {
      value(id: TestId) {
        return this.find(createTestIdSelector(id))
      }
    },
    findComponentByTestId: {
      value(id: TestId) {
        return this.findComponent(createTestIdSelector(id))
      }
    },
    findAllByTestId: {
      value(id: TestId) {
        return this.findAll(createTestIdSelector(id))
      }
    },
    findAllComponentsByTestId: {
      value(id: TestId) {
        return this.findAllComponents(createTestIdSelector(id))
      }
    },
    findDeepByByTestId: {
      value(idChain: Array<TestId> = []) {
        if (!Array.isArray(idChain) || isEmpty(idChain)) {
          throw new Error('idChain should be an array of test ids in order of nesting')
        }

        const selectorsChain = idChain.map(id => createTestIdSelector(id)).join(' ')
        return this.find(selectorsChain)
      }
    }
  }) as ExtendedVueWrapper
}
