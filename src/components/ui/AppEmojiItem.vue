<template>
  <label :class="{ 'aei-Item-active': isShowEmoji }" class="aei-Item">
    <span class="aei-Item_Content">
      <span class="aei-ContentFront" />
      <span class="aei-ContentBack">
        <template v-if="isShowEmoji">
          {{ item[EMOJI] }}
        </template>
      </span>
    </span>

    <input
      v-model="localValue"
      :disabled="isDisabled"
      :value="item[PUBLIC_ID]"
      hidden
      type="checkbox"
    />
  </label>
</template>

<script lang="ts" setup>
import { computed, type ComputedRef, type PropType } from 'vue'

import { EMOJI_ITEM_KEYS, type EmojiItem } from '@/utils/emoji'

defineOptions({
  name: 'AppEmojiItem'
})

const props = defineProps({
  item: {
    type: Object as PropType<EmojiItem>,
    required: true
  },

  isDisabled: {
    type: Boolean as PropType<boolean>
  },

  modelValue: {
    type: Array as PropType<string[]>,
    required: true
  },

  isSolved: {
    type: Boolean as PropType<boolean>
  }
})

const { EMOJI, PUBLIC_ID } = EMOJI_ITEM_KEYS

const emit = defineEmits({
  'update:model-value': null
})

const localValue = computed<string[]>({
  get: (): string[] => props.modelValue,
  set: (value: string[]) => {
    emit('update:model-value', value)
  }
})

const isShowEmoji = computed(() => {
  return localValue.value.includes(props.item[PUBLIC_ID]) || props.isSolved
}) as ComputedRef<boolean>
</script>

<style lang="scss" scoped>
.aei-Item {
  width: 80px;
  height: 80px;
  cursor: pointer;
  perspective: 1000px;
  display: flex;
  font-size: 40px;
  color: initial;
}

.aei-Item_Content {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: cubic-bezier(0.17, 0.67, 0.83, 0.67) 0.2s;
  transform-style: preserve-3d;

  .aei-Item-active & {
    transform: rotateY(180deg);
  }
}

.aei-ContentFront,
.aei-ContentBack {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  border-radius: 12px;
}

.aei-ContentFront {
  background-color: var(--vt-c-black-mute);

  @media (any-hover: hover) {
    &:hover {
      background-color: var(--vt-c-black-soft);
    }
  }
}

.aei-ContentBack {
  background-color: #2fffb2;
  transform: rotateY(180deg);
}
</style>
