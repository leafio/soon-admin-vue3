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
import type { RouteLocationNormalized } from "vue-router"
import { useTabsStore } from "@/store/modules/tabs"

import { tLocales } from "@/i18n"
import en_tabbar from "@/i18n/locales/en/tabbar"
import ko_tabbar from "@/i18n/locales/ko/tabbar"
import zh_tabbar from "@/i18n/locales/zh/tabbar"
const t = tLocales({
  zh: zh_tabbar,
  en: en_tabbar,
  ko: ko_tabbar,
})

const props = defineProps<{
  curIndex: number
  targetRef: Element
  tab: RouteLocationNormalized
  visible: boolean
}>()
const { curIndex, targetRef, tab, visible } = toRefs(props)

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
</script>
<style scoped lang="scss">
.context-menu {
  @apply flex justify-center py-1 px-2 cursor-pointer;
}

.context-menu:hover {
  @apply bg-primary-100 text-primary-600;
}
</style>
