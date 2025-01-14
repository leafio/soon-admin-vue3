<template>
  <template v-for="[fullPath, { Comp, link }] in compList" :key="fullPath">
    <component :is="Comp" :class="{ hidden: name !== fullPath }" :link="link" />
  </template>
</template>

<script setup lang="ts">
import { type Component, shallowRef, watch, computed } from "vue"
import { useMultiFrame } from "./func"

const props = defineProps<{
  comp: Component
  iframeSrc?: string
  isKeepAlive?: boolean
  name: string
  refreshing: boolean
  names: string[]
}>()

const iframeList = computed(() => props.names)

const compList = shallowRef<[string, { Comp: Component; link: string }][]>([])
const { setMap, getMap, MAP, delMap } = useMultiFrame()

watch(
  () => iframeList.value.length,
  () => {
    for (const i of MAP.keys()) {
      if (!iframeList.value.some((s) => s === i)) {
        delMap(i)
        compList.value = getMap()
      }
    }
  },
)

watch(
  [() => props.name, () => props.refreshing],
  ([path, refreshing]) => {
    if (refreshing || !props.isKeepAlive) {
      delMap(props.name)
      compList.value = getMap()
    }

    nextTick(() => {
      if (!props.iframeSrc) return

      const sameKey = [...MAP.keys()].find((i) => path === i)
      if (!sameKey) {
        // 添加缓存
        setMap(path, props.comp, props.iframeSrc)
        compList.value = getMap()
      }
    })
  },
  {
    immediate: true,
  },
)
</script>
