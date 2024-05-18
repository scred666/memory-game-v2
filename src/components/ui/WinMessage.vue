<template>
  <WinMessage />
</template>

<script lang="ts" setup>
import type { ComponentInternalInstance } from 'vue'
import { getCurrentInstance, h, VNode } from 'vue'

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

const WinMessage = () => {
  const currentInstance = getCurrentInstance() as ComponentInternalInstance
  const vnode = currentInstance.vnode as VNode
  const { scopeId } = vnode
  const scopeIdAttribute: Record<string, string> = scopeId ? { [scopeId]: '' } : {}

  return h(
    'div',
    {
      class: 'wm-Message'
    },
    h(
      'div',
      {
        ...scopeIdAttribute,
        class: 'wm-Message_Content'
      },
      [
        h(
          'div',
          {
            ...scopeIdAttribute,
            class: 'wm-Message_Title'
          },
          '🎉 Congratulations! 🥳'
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
.wm-Message {
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

.wm-Message_Content {
  gap: 20px;
  align-items: center;
  display: flex;
  flex-direction: column;
}

.wm-Message_Title {
  font-size: 40px;
  color: var(--vt-green);
  font-weight: bold;
  height: 100%;
}
</style>
