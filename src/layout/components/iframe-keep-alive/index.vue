<template>
  <template v-for="[fullPath, { Comp, link }] in compList" :key="fullPath">
    <component :is="Comp" :class="{ hidden: name !== fullPath }" :link="link" />
  </template>
</template>

<script setup lang="ts">
import { type Component, shallowRef, watch, computed } from "vue"

const Iframe_MAP = new Map<string, { Comp: any; link: string }>()

function getMap() {
  return [...Iframe_MAP.entries()]
}

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

watch(
  () => iframeList.value.length,
  () => {
    for (const i of Iframe_MAP.keys()) {
      if (!iframeList.value.some((s) => s === i)) {
        Iframe_MAP.delete(i)
        compList.value = getMap()
      }
    }
  },
)

watch(
  [() => props.name, () => props.refreshing],
  ([path, refreshing]) => {
    if (refreshing || !props.isKeepAlive) {
      Iframe_MAP.delete(props.name)
      compList.value = getMap()
    }

    nextTick(() => {
      if (!props.iframeSrc) return

      const sameKey = [...Iframe_MAP.keys()].find((i) => path === i)
      if (!sameKey) {
        // 添加缓存
        Iframe_MAP.set(path, { Comp: props.comp, link: props.iframeSrc })
        compList.value = getMap()
      }
    })
  },
  {
    immediate: true,
  },
)
</script>
