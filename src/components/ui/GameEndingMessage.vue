<template>
  <GameEndingMessage>
    <slot>🎉 Congratulations! 🥳</slot>
  </GameEndingMessage>
</template>

<script lang="ts" setup>
import type { SetupContext } from 'vue'
import type { ComponentInternalInstance } from 'vue'
import { type Component } from 'vue'
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

const GameEndingMessage = (_: Component, { slots, attrs }: SetupContext) => {
  const currentInstance = getCurrentInstance() as ComponentInternalInstance
  const vnode = currentInstance.vnode as VNode
  const { scopeId } = vnode

  type ScopeIdAttribute = { [key: string]: '' }
  const scopeIdAttribute: ScopeIdAttribute = scopeId
    ? { [scopeId]: '' }
    : /* istanbul ignore next */ {} // ignored because it's impossible to mock getCurrentInstance declared as Object.defineProperty

  return h(
    'div',
    {
      class: 'gem-Message',
      ...attrs
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

<style lang="scss" scoped>
.gem-Message {
  position: fixed;
  height: 100vh;
  width: 100vw;
  top: 0;
  left: 0;
  background-color: hsl(from var(--vt-c-black) h s l / 80%);
  backdrop-filter: blur(5px);
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
}

.gem-Message_Content {
  gap: 20px;
  align-items: center;
  display: flex;
  flex-direction: column;
}

.gem-Message_Title {
  font-size: clamp(24px, calc(100vw / 15), 40px);

  color: var(--theme-color, var(--vt-c-green));
  font-weight: bold;
  height: 100%;
}
</style>
