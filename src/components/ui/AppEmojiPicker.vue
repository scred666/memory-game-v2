<template>
  <div class="aip-Picker">
    <AppEmojiItem
      v-for="item in normalizedEmojiList"
      :key="item[PUBLIC_ID]"
      v-model="selectedItems"
      :is-disabled="isDisabled({ item })"
      :is-solved="solvedItems.includes(item[PRIVATE_ID])"
      :item="item"
    />
  </div>
  <button @click="reshuffle">+</button>
</template>

<script lang="ts" setup>
import { computed, type ComputedRef, ref, watch } from 'vue'

import AppEmojiItem from '@/components/ui/AppEmojiItem.vue'
import { EMOJI_ITEM_KEYS, EMOJI_LIST, type EmojiItem } from '@/utils/emoji'
import { shuffleArray } from '@/utils/helpers'
import { uid } from '@/utils/uid'

defineOptions({
  name: 'AppEmojiPicker'
})

const { PUBLIC_ID, PRIVATE_ID } = EMOJI_ITEM_KEYS

const emojiList = ref<string[]>(EMOJI_LIST)

const normalizedEmojiList = computed(() => {
  const enrichedList = emojiList.value.flatMap(emoji => {
    const privateId = uid()
    const item = {
      emoji,
      [PRIVATE_ID]: privateId
    }

    return [
      {
        ...item,
        [PUBLIC_ID]: uid()
      },
      {
        ...item,
        [PUBLIC_ID]: uid()
      }
    ]
  })

  return shuffleArray(enrichedList)
}) as ComputedRef<EmojiItem[]>

const reshuffle = (): void => {
  emojiList.value = shuffleArray(emojiList.value)
}

const selectedItems = ref<string[]>([])

const isSelectionComplete = computed(() => {
  return selectedItems.value.length === 2
}) as ComputedRef<boolean>

const isDisabled = ({ item }: { item: EmojiItem }): boolean => {
  return (
    isSelectionComplete.value ||
    selectedItems.value.includes(item[PUBLIC_ID]) ||
    solvedItems.value.includes(item[PRIVATE_ID])
  )
}

const solvedItems = ref<string[]>([])

const isGameWin = computed(() => {
  return solvedItems.value.length === emojiList.value.length
}) as ComputedRef<boolean>

watch(selectedItems, () => {
  if (isSelectionComplete.value) {
    const [first, second] = selectedItems.value
    const originalFirst = normalizedEmojiList.value.find(
      item => item[PUBLIC_ID] === first
    ) as EmojiItem
    const originalSecond = normalizedEmojiList.value.find(
      item => item[PUBLIC_ID] === second
    ) as EmojiItem

    if (originalFirst[PRIVATE_ID] === originalSecond[PRIVATE_ID]) {
      solvedItems.value = [...solvedItems.value, originalFirst[PRIVATE_ID]]
    }

    setTimeout(() => {
      selectedItems.value = []
    }, 500)
  }
})
</script>

<style scoped>
.aip-Picker {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
}
</style>
