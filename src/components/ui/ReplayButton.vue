<template>
  <button :disabled="disabled" class="rb-Button" @click="onClick">
    <slot>New Game</slot>
  </button>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'

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
  background-color: var(--theme-color, var(--vt-green));
  border: none;
  color: var(--vt-c-black);
  font-size: 18px;
  padding: var(--padding, 10px 16px);
  line-height: 1;
  font-weight: bold;
  border-radius: 4px;
  cursor: pointer;

  &:disabled {
    background-color: var(--vt-c-black-soft);
    color: var(--vt-c-text-dark-2);
    cursor: not-allowed;
  }

  transition: cubic-bezier(0.17, 0.67, 0.83, 0.67) 0.2s;

  @media (any-hover: hover) {
    &:not(&:disabled) {
      &:hover {
        background-color: hsl(from var(--theme-color, var(--vt-green)) h s calc(l - 0.15));
      }
    }
  }

  &:active {
    &:not(&:disabled) {
      background-color: hsl(from var(--theme-color, var(--vt-green)) h s calc(l - 0.3));
    }
  }
}
</style>
