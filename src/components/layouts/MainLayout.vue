<template>
  <section class="ml-Layout">
    <DifficultSwitcher v-model="currentDifficult" />
    <AppEmojiPicker :current-difficult="difficultOptions" />
  </section>
</template>

<script lang="ts" setup>
import { computed, type ComputedRef, ref } from 'vue'

import AppEmojiPicker from '@/components/ui/AppEmojiPicker.vue'
import DifficultSwitcher from '@/components/ui/DifficultSwitcher.vue'
import {
  type Difficult,
  DIFFICULTIES,
  type DifficultName,
  DIFFICULTY_KEYS
} from '@/utils/difficult-switcher'

defineOptions({
  name: 'MainLayout'
})

const currentDifficult = ref<DifficultName>(DIFFICULTIES.EASY[DIFFICULTY_KEYS.NAME])

const difficultOptions = computed(() => {
  return (
    Object.values(DIFFICULTIES).find(
      difficult => difficult[DIFFICULTY_KEYS.NAME] === currentDifficult.value
    ) || DIFFICULTIES.EASY
  )
}) as ComputedRef<Difficult>
</script>

<style lang="scss" scoped>
.ml-Layout {
  display: grid;
  gap: 16px;
  padding: 32px;

  @include media(
    (
      padding: (
        0: 24px,
        768: 32px
      )
    )
  );
}
</style>
