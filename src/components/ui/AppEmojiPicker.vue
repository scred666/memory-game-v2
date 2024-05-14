<template>
  <div :style="{ '--color': `var(${currentDifficult.color})` }" class="aip-Picker">
    <AppEmojiItem
      v-for="item in normalizedEmojiList"
      :key="item[PUBLIC_ID]"
      v-model="selectedItems"
      :is-disabled="isDisabled({ item })"
      :is-solved="solvedItems.includes(item[PRIVATE_ID])"
      :item="item"
    />
  </div>
  <ReplayButton @click="replay" />
</template>

<script lang="ts" setup>
import { computed, type ComputedRef, type PropType, ref, watch } from 'vue'

import AppEmojiItem from '@/components/ui/AppEmojiItem.vue'
import ReplayButton from '@/components/ui/ReplayButton.vue'
import { type Difficult, DIFFICULTY_KEYS } from '@/utils/difficult-switcher'
import { EMOJI_ITEM_KEYS, EMOJI_LIST, type EmojiItem } from '@/utils/emoji'
import { shuffleArray } from '@/utils/helpers'
import { uid } from '@/utils/uid'

defineOptions({
  name: 'AppEmojiPicker'
})

const props = defineProps({
  currentDifficult: {
    type: Object as PropType<Difficult>,
    required: true
  }
})

const { PUBLIC_ID, PRIVATE_ID } = EMOJI_ITEM_KEYS

const emojiList = ref<string[]>([...EMOJI_LIST])

const listByDifficult = computed(() => {
  return shuffleArray(emojiList.value).slice(0, props.currentDifficult[DIFFICULTY_KEYS.COUNT])
}) as ComputedRef<string[]>

const normalizedEmojiList = computed(() => {
  if (isGameWin.value) {
    return []
  }
  const enrichedList = listByDifficult.value.flatMap(emoji => {
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

const replay = (): void => {
  resetState()
  setTimeout(() => {
    emojiList.value = shuffleArray(emojiList.value)
  }, 500)
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
  return solvedItems.value.length === listByDifficult.value.length
}) as ComputedRef<boolean>

watch(isGameWin, newValue => {
  if (newValue) {
    console.log('win')
  }
})

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

const resetState = (): void => {
  selectedItems.value = []
  solvedItems.value = []
}

watch(
  () => props.currentDifficult,
  () => {
    resetState()
  }
)
</script>

<style scoped>
.aip-Picker {
  justify-content: center;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
</style>
