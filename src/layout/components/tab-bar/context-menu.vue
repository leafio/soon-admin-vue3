<template>
  <el-popover :virtual-ref="targetRef" :visible="visible" virtual-triggering :popper-class="'!p-0 !min-w-fit'" :popper-style="{ width: 'auto' }">
    <ul>
      <li class="context-menu" @click="handleRefresh">{{ t("refresh") }}</li>
      <li v-if="!tab?.meta?.isAffix" class="context-menu" @click="handleClose">{{ t("close") }}</li>
      <li class="context-menu" @click="handleCloseOthers">
        {{ t("closeOthers") }}
      </li>
      <li class="context-menu" @click="handleCloseAll">
        {{ t("closeAll") }}
      </li>
      <!-- <li class="context-menu" @click="handleFullscreen">{{ t("fullscreen") }}</li> -->
    </ul>
  </el-popover>
</template>
<script setup lang="ts">
import { tMessages } from "@/i18n"
import { useTabsStore } from "@/store/modules/tabs"
import { RouteLocationNormalized } from "vue-router"
const props = defineProps<{
  curIndex: number
  targetRef: Element
  tab: RouteLocationNormalized
  visible: boolean
}>()
const { curIndex, targetRef, tab, visible } = toRefs(props)

const t = tMessages({
  zh: {
    refresh: "刷新",
    close: "关闭当前",
    closeOthers: "关闭其它",
    closeAll: "关闭所有",
    fullscreen: "全屏",
  },
  en: {
    refresh: "Refresh",
    close: "Close",
    closeOthers: "Close Others",
    closeAll: "Close All",
    fullscreen: "Fullscreen",
  },
})
const router = useRouter()
const tabStore = useTabsStore()

const handleRefresh = () => {
  tabStore.refreshTabByIndex(curIndex.value)
}
const handleClose = () => {
  tabStore.closeByIndex(curIndex.value)
}

const handleCloseOthers = () => {
  tabStore.closeOthers(curIndex.value)
}

const handleCloseAll = () => {
  tabStore.closeAll()
  router.push("/")
}
const handleFullscreen = () => {}
</script>
<style scoped lang="scss">
.context-menu {
  @apply flex justify-center py-1 px-2 cursor-pointer;
}

.context-menu:hover {
  background-color: var(--el-menu-hover-bg-color);
  color: var(--el-menu-hover-text-color);
}
</style>
