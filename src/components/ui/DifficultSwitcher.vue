<template>
  <div class="ds-Switcher">
    <template v-for="difficult in Object.values(DIFFICULTIES)" :key="difficult[COLOR]">
      <input
        :id="createId({ difficult })"
        v-model="localValue"
        :value="difficult[NAME]"
        class="ds-Switcher_Input"
        hidden
        name="difficult-switcher"
        type="radio"
      />
      <label
        :for="createId({ difficult })"
        :style="{ '--color': `var(${difficult[COLOR]})` }"
        class="ds-Switcher_Label"
      >
        {{ difficult[NAME] }}
      </label>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed, type PropType } from 'vue'

import { DIFFICULTIES, type Difficult, DIFFICULTY_KEYS } from '@/utils/difficult-switcher'

const { COLOR, NAME } = DIFFICULTY_KEYS

defineOptions({
  name: 'DifficultSwitcher'
})

const props = defineProps({
  modelValue: {
    type: String as PropType<string>,
    required: true,
    validator: (v: string): boolean => {
      return Object.values(DIFFICULTIES).some(difficult => difficult[DIFFICULTY_KEYS.NAME] === v)
    }
  }
})

const createId = ({ difficult }: { difficult: Difficult }): string => `difficult-${difficult[NAME]}`

const emit = defineEmits<{
  'update:model-value': [value: string]
}>()

const localValue = computed<string>({
  get: (): string => props.modelValue,
  set: (value: string): void => {
    emit('update:model-value', value)
  }
})
</script>

<style lang="scss" scoped>
.ds-Switcher {
  display: flex;
  justify-content: center;
}

.ds-Switcher_Label {
  color: var(--color);
  font-size: 16px;
  text-transform: uppercase;
  padding: 8px 20px;
  font-weight: bold;
  transition: cubic-bezier(0.17, 0.67, 0.83, 0.67) 0.2s;
  cursor: pointer;

  .ds-Switcher:hover & {
    &:not(&:hover) {
      opacity: 0.5;
    }
  }

  @media (any-hover: hover) {
    &:hover {
      opacity: 1;
    }
  }
}

.ds-Switcher_Input {
  &:checked + .ds-Switcher_Label {
    box-shadow: inset 0 -4px 0 var(--color);
  }
}
</style>
