<template>
  <button @click="onClick">New game</button>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'ReplayButton'
})

const emit = defineEmits<{
  click: [e: MouseEvent]
}>()

const onClick = (e: MouseEvent) => {
  emit('click', e)
}
</script>

<style scoped></style>
