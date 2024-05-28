<template>
  <GameEndingMessage>
    <slot> 🎉 Congratulations! 🥳</slot>
  </GameEndingMessage>
</template>

<script lang="ts" setup>
import type { Component } from 'vue'
import type { SetupContext } from 'vue'
import type { ComponentInternalInstance } from 'vue'
import { getCurrentInstance, h, type VNode } from 'vue'

import ReplayButton from '@/components/ui/ReplayButton.vue'

defineOptions({
  name: 'GameEndingMessage'
})

const emit = defineEmits<{
  replay: []
}>()

const onClick = (): void => {
  emit('replay')
}

const GameEndingMessage = (_: Component, { slots }: SetupContext) => {
  const currentInstance = getCurrentInstance() as ComponentInternalInstance
  const vnode = currentInstance.vnode as VNode
  const { scopeId } = vnode
  const scopeIdAttribute: Record<string, string> = scopeId ? { [scopeId]: '' } : {}

  return h(
    'div',
    {
      class: 'gem-Message'
    },
    h(
      'div',
      {
        ...scopeIdAttribute,
        class: 'gem-Message_Content'
      },
      [
        h(
          'div',
          {
            ...scopeIdAttribute,
            class: 'gem-Message_Title'
          },
          slots.default?.()
        ),

        h(ReplayButton, {
          onClick
        })
      ]
    )
  )
}
</script>

<style scoped>
.gem-Message {
  position: fixed;
  height: 100vh;
  width: 100vw;
  top: 0;
  left: 0;
  background-color: rgba(var(--vt-c-black-rgb), 0.8);
  backdrop-filter: blur(5px);
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.gem-Message_Content {
  gap: 20px;
  align-items: center;
  display: flex;
  flex-direction: column;
}

.gem-Message_Title {
  font-size: 40px;
  color: var(--theme-color, var(--vt-green));
  font-weight: bold;
  height: 100%;
}
</style>
