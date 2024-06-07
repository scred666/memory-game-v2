<template>
  <div class="aem-Toolbar">
    <div :data-test-id="APP_TEST_IDS.EMOJI_PICKER_SOLVED_COUNTER" class="aep-Toolbar_Counter">
      {{ solvedItems.length }} / {{ currentDifficult[DIFFICULTY_KEYS.COUNT] }}
    </div>

    <ReplayButton :disabled="isEmpty(solvedItems)" class="aep-Toolbar_Button" @click="replay">
      Restart 🎲
    </ReplayButton>

    <div :data-test-id="APP_TEST_IDS.EMOJI_PICKER_ATTEMPTS_COUNTER" class="aep-Toolbar_Counter">
      {{ availableAttempts }}
    </div>
  </div>

  <div
    :data-test-id="APP_TEST_IDS.EMOJI_PICKER"
    :style="{ '--color': `var(${currentDifficult[DIFFICULTY_KEYS.COLOR]})` }"
    class="aep-Picker"
  >
    <AppEmojiItem
      v-for="item in normalizedEmojiList"
      :key="item[PUBLIC_ID]"
      v-model="selectedItems"
      :is-disabled="isDisabled({ item })"
      :is-solved="solvedItems.includes(item[PRIVATE_ID])"
      :item="item"
    />
  </div>

  <transition-group name="end-message">
    <GameEndingMessage v-if="isGameWin" :data-test-id="APP_TEST_IDS.WIN_MESSAGE" @replay="replay" />

    <GameEndingMessage
      v-else-if="isGameLose"
      :data-test-id="APP_TEST_IDS.LOSE_MESSAGE"
      style="--theme-color: var(--vt-c-red)"
      @replay="replay"
    >
      😔 Game Over 🤬
    </GameEndingMessage>
  </transition-group>
</template>

<script lang="ts" setup>
import { isEmpty, isEqual } from 'lodash-es'
import { computed, type ComputedRef, defineAsyncComponent, type PropType, ref, watch } from 'vue'

import AppEmojiItem from '@/components/ui/AppEmojiItem.vue'
import ReplayButton from '@/components/ui/ReplayButton.vue'
import { type Difficult, DIFFICULTIES, DIFFICULTY_KEYS } from '@/utils/difficult-switcher'
import { EMOJI_ITEM_KEYS, EMOJI_LIST, type EmojiItem } from '@/utils/emoji'
import { shuffleArray, TIMEOUT_DELAY } from '@/utils/helpers'
import { APP_TEST_IDS } from '@/utils/tests-helpers'
import { uid } from '@/utils/uid'

const GameEndingMessage = defineAsyncComponent(
  () => import('@/components/ui/GameEndingMessage.vue')
)

defineOptions({
  name: 'AppEmojiPicker'
})

const props = defineProps({
  currentDifficult: {
    type: Object as PropType<Difficult>,
    default: DIFFICULTIES.EASY,
    required: true,
    validator: (v: Difficult): boolean => {
      return Object.values(DIFFICULTIES).some(difficult => isEqual(difficult, v))
    }
  }
})

const { PUBLIC_ID, PRIVATE_ID } = EMOJI_ITEM_KEYS

const emojiList = ref<string[]>([...EMOJI_LIST])

const listByDifficult = computed(() => {
  return shuffleArray(emojiList.value).slice(0, props.currentDifficult[DIFFICULTY_KEYS.COUNT])
}) as ComputedRef<string[]>

const normalizedEmojiList = computed(() => {
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

const isReplayStarted = ref<boolean>(false)

const replay = (): void => {
  resetState()
  isReplayStarted.value = true
  setTimeout(() => {
    isReplayStarted.value = false
    emojiList.value = shuffleArray(emojiList.value)
  }, TIMEOUT_DELAY)
}

const selectedItems = ref<string[]>([])

const isSelectionComplete = computed(() => {
  return selectedItems.value.length === 2
}) as ComputedRef<boolean>

const isDisabled = ({ item }: { item: EmojiItem }): boolean => {
  return (
    isReplayStarted.value ||
    isSelectionComplete.value ||
    selectedItems.value.includes(item[PUBLIC_ID]) ||
    solvedItems.value.includes(item[PRIVATE_ID])
  )
}

const solvedItems = ref<string[]>([])

const isGameWin = computed(() => {
  return solvedItems.value.length === listByDifficult.value.length
}) as ComputedRef<boolean>

const isGameLose = computed(() => {
  return (
    !availableAttempts.value ||
    availableAttempts.value <
      props.currentDifficult[DIFFICULTY_KEYS.COUNT] - solvedItems.value.length
  )
}) as ComputedRef<boolean>

const usedAttempts = ref<number>(0)

watch(isSelectionComplete, newValue => {
  if (newValue) {
    usedAttempts.value += 1
    const [first, second] = selectedItems.value

    const originalFirst = normalizedEmojiList.value.find(
      item => item[PUBLIC_ID] === first
    ) as EmojiItem

    const originalSecond = normalizedEmojiList.value.find(
      item => item[PUBLIC_ID] === second
    ) as EmojiItem

    if (
      originalFirst &&
      originalSecond &&
      originalFirst[PRIVATE_ID] === originalSecond[PRIVATE_ID]
    ) {
      solvedItems.value = [...solvedItems.value, originalFirst[PRIVATE_ID]]
      selectedItems.value = []
    } else {
      setTimeout(() => {
        selectedItems.value = []
      }, TIMEOUT_DELAY)
    }
  }
})

const resetState = (): void => {
  selectedItems.value = []
  solvedItems.value = []
  usedAttempts.value = 0
}

watch(
  () => props.currentDifficult,
  () => {
    resetState()
  }
)

const availableAttempts = computed(() => {
  return Math.max(0, props.currentDifficult[DIFFICULTY_KEYS.ATTEMPTS] - usedAttempts.value)
}) as ComputedRef<number>
</script>

<style lang="scss" scoped>
.aep-Picker {
  justify-content: center;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  max-width: 1320px;
  margin-inline: auto;

  @include media(
    (
      padding-inline: (
        0: 16px,
        768: 32px
      )
    )
  );
}

.aem-Toolbar {
  display: flex;
  align-items: center;
  justify-content: center;

  @include media(
    (
      gap: (
        0: 16px,
        768: 40px
      )
    )
  );

  position: sticky;
  top: 0;
  z-index: 1;
  background-color: hsl(from var(--color-background) h s l / 70%);
  backdrop-filter: blur(5px);
  padding-block: 16px;
}

.aep-Toolbar_Counter {
  text-transform: uppercase;
  font-weight: bold;
  text-align: center;

  @include media(
    (
      font-size: (
        0: 12px,
        768: 18px
      )
    )
  );

  @include media(
    (
      min-width: (
        0: 60px,
        768: 100px
      )
    )
  );
}

.aep-Toolbar_Button {
  --padding: 10px 16px 10px 20px;
}

.end-message-enter-active,
.end-message-leave-active {
  transition: 0.2s;
}

.end-message-enter-from,
.end-message-leave-to {
  opacity: 0;
  transform: scale(1.15);
}
</style>
