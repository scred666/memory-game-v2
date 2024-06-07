<template>
  <button
    :data-test-id="APP_TEST_IDS.REPLAY_BUTTON"
    :disabled="disabled"
    class="rb-Button"
    @click="onClick"
  >
    <slot>New Game</slot>
  </button>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'

import { APP_TEST_IDS } from '@/utils/tests-helpers'

defineOptions({
  name: 'ReplayButton'
})

const props = defineProps({
  disabled: {
    type: Boolean as PropType<boolean>
  }
})

const emit = defineEmits<{
  click: [e: MouseEvent]
}>()

const onClick = (e: MouseEvent) => {
  if (!props.disabled) {
    emit('click', e)
  }
}
</script>

<style lang="scss" scoped>
.rb-Button {
  font-family: var(--font-family);
  background-color: var(--theme-color, var(--vt-c-green));
  border: none;
  color: var(--color-background);
  @include media(
    (
      font-size: (
        0: 14px,
        768: 18px
      )
    )
  );
  padding: var(--padding, 10px 16px);
  line-height: 1;
  font-weight: bold;
  border-radius: 4px;
  cursor: pointer;

  &:disabled {
    background-color: var(--vt-c-black-soft);
    color: var(--color-text);
    cursor: not-allowed;
  }

  transition: var(--base-transtion);

  @media (any-hover: hover) {
    &:not(&:disabled) {
      &:hover {
        background-color: hsl(from var(--theme-color, var(--vt-c-green)) h s calc(l - 8));
        @-moz-document url-prefix() {
          background-color: var(--theme-color, var(--vt-c-green));
        }
      }
    }
  }

  &:active {
    &:not(&:disabled) {
      background-color: hsl(from var(--theme-color, var(--vt-c-green)) h s calc(l - 15));

      @-moz-document url-prefix() {
        background-color: var(--theme-color, var(--vt-c-green));
      }
    }
  }
}
</style>
