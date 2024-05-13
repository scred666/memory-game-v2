<script lang="ts" setup>
import AppEmojiPicker from '@/components/ui/AppEmojiPicker.vue'
import { EMOJI_LIST } from '@/utils/emoji'
</script>

<template>
  <main>
    <AppEmojiPicker :emoji-list="EMOJI_LIST" />
  </main>
</template>

<style scoped></style>
