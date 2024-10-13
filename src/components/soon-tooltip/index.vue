<template>
  <div>
    <button ref="reference" @mouseenter="handleShowTip" @mouseleave="handleHideTip">Button</button>
    <div v-if="!hidden" ref="floating" :style="floatingStyles" class="bg-black opacity-75 px-1 py-0.5 text-sm text-white">Tooltip</div>
  </div>
</template>

<script setup lang="ts">
import { useFloating, autoUpdate } from "@floating-ui/vue"
const hidden = ref(true)
const handleShowTip = () => {
  //   visibility.value = "visible"
  setTimeout(() => (hidden.value = false))
}
const handleHideTip = () => {
  //   visibility.value = "hidden"
  hidden.value = true
}

const reference = ref(null)
const floating = ref(null)
const { floatingStyles } = useFloating(reference, floating, {
  // strategy:'fixed'
  whileElementsMounted: autoUpdate,
})
</script>
