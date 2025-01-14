<template>
  <component :is="Object.assign({}, icon.val)" v-if="icon.type === 'component'" />
  <img v-else-if="icon.type === 'src'" :src="icon.val" />
  <i v-else-if="icon.type === 'icon-font'" :class="icon.val"></i>
  <div v-else-if="icon.type === 'svg'" v-html="icon.val"></div>
</template>
<script setup lang="ts">
import icons from "./icons"
const { value } = defineProps<{ value: string | Component }>()
const icon = computed(() => {
  let type = "component"
  let val: any = value
  if (typeof value === "string") {
    if (value.includes("<svg")) type = "svg"
    else if (value.includes("/")) type = "src"
    else if (value.includes(" ")) type = "icon-font"
    else {
      val = icons[value]
    }
  }
  return {
    type,
    val,
  }
})
</script>
