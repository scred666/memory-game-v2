<template>
  <div class="ds-Switcher">
    <div
      v-for="(difficult, index) in Object.values(DIFFICULTIES)"
      :key="difficult[COLOR]"
      class="ds-Switcher_Item"
    >
      <input
        :id="createId({ difficult })"
        v-model="localValue"
        :value="difficult[NAME]"
        class="ds-ItemInput"
        hidden
        name="difficult-switcher"
        type="radio"
      />
      <label
        :for="createId({ difficult })"
        :style="{ '--color': `var(${difficult[COLOR]})`, '--index': index + 1 }"
        class="ds-ItemLabel"
      >
        {{ difficult[NAME] }}
      </label>
    </div>
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
  justify-content: center;
  display: flex;
  flex-wrap: wrap;
  row-gap: 10px;
  text-align: center;
}

.ds-Switcher_Item {
  @include media(
    (
      min-width: (
        0: 100px,
        400: 120px,
        500: unset
      )
    )
  );
}

.ds-ItemLabel {
  color: var(--color);
  display: inline-block;
  width: 100%;

  @include media(
    (
      font-size: (
        0: 14px,
        768: 16px
      )
    )
  );

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

.ds-ItemInput {
  &:checked + .ds-ItemLabel {
    @include media(
      (
        box-shadow: (
          0: var(--color),
          500: inset 0 -4px 0 var(--color)
        )
      )
    );

    @include media(
      (
        border-radius: (
          0: 6px,
          500: 0
        )
      )
    );

    @include media(
      (
        background-color: (
          0: var(--color),
          500: initial
        )
      )
    );

    @include media(
      (
        color: (
          0: var(--color-background),
          500: var(--color)
        )
      )
    );
  }
}
</style>
