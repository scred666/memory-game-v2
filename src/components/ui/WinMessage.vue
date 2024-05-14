<template>
  <div class="wm-Message">
    <div class="wm-Message_Title">🎉 Solved 🥳</div>

    <ReplayButton @click="onClick" />
  </div>
</template>

<script lang="ts" setup>
import ReplayButton from '@/components/ui/ReplayButton.vue'

defineOptions({
  name: 'WinMessage'
})

const emit = defineEmits<{
  replay: []
}>()

const onClick = (): void => {
  emit('replay')
}
</script>

<style scoped>
.wm-Message {
  gap: 20px;
  align-items: center;
  display: flex;
  flex-direction: column;
}

.wm-Message_Title {
  font-size: 40px;
  color: var(--vt-green);
  font-weight: bold;
}
</style>
