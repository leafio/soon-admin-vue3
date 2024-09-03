<template>
  <template v-for="[fullPath, { Comp, link }] in compList" :key="fullPath">
    <component :is="Comp" :class="{ hidden: fullPath !== currRoute.fullPath }" :link="link" />
  </template>
</template>

<script setup lang="ts">
import { useTabsStore } from "@/store/modules/tabs"
import { type Component, shallowRef, watch, computed } from "vue"
import { RouteLocationNormalizedLoaded } from "vue-router"
import { useMultiFrame } from "./func"

const props = defineProps<{
  currRoute: RouteLocationNormalizedLoaded
  currComp: Component
  refreshing: boolean
}>()

const tabsMenuList = computed(() => useTabsStore().tabList)

const compList = shallowRef<any[]>([])
const { setMap, getMap, MAP, delMap } = useMultiFrame()

const keepShow = computed(() => {
  return props.currRoute.meta?.isKeepAlive && !!props.currRoute.meta?.isIframe && props.currRoute.meta.link
})

watch(
  () => tabsMenuList.value.length,
  () => {
    for (const i of MAP.keys()) {
      if (!tabsMenuList.value.some((s) => s.fullPath === i)) {
        delMap(i)
        compList.value = getMap()
      }
    }
  },
)

watch(
  [() => props.currRoute.fullPath, () => props.refreshing],
  ([path, refreshing]) => {
    if (refreshing) {
      delMap(props.currRoute.fullPath)
      compList.value = getMap()
    }

    nextTick(() => {
      if (keepShow.value) {
        const sameKey = [...MAP.keys()].find((i) => path === i)
        if (!sameKey) {
          // 添加缓存
          setMap(path, props.currComp, props.currRoute.meta.link)
          compList.value = getMap()
        }
      }
    })
  },
  {
    immediate: true,
  },
)
</script>
