<template>
  <el-drawer v-model="visible" direction="rtl" size="80%">
    <div class="flex flex-col mb-4 gap-2">
      <div class="flex justify-around">
        <el-button class="w-2/5 text-center" @click="handleCloseOthers">{{ t("closeOthers") }}</el-button>
        <el-button type="primary" class="w-2/5 text-center" @click="handleRefresh">{{ t("refresh") }}</el-button>
      </div>
      <div class="flex justify-around">
        <el-button class="w-2/5 text-center" @click="handleCloseAll">{{ t("closeAll") }}</el-button>
        <el-button type="primary" plain class="w-2/5 text-center" @click="handleClose">{{ t("close") }}</el-button>
      </div>
    </div>
    <div
      v-for="(tab, index) in tabsMenuList"
      :key="index"
      class="flex justify-between items-center px-1 py-2 border-t border-solid"
      :class="tabStore.activeIndex === index ? ' text-primary-700' : ''"
    >
      <BIconXLg class="mr-4 text-neutral-400" @click="handleCloseByIndex(index)" />
      <div class="flex items-center" @click="handleGoTo(tab)">
        <div>{{ showMenuTitle(tab.meta?.title) }}</div>
        <BIconChevronRight class="w-6 h-6 p-1 ml-1 cursor-pointer" />
      </div>
    </div>
  </el-drawer>
</template>
<script setup lang="ts">
import { useTabsStore } from "@/store/modules/tabs"
import { showMenuTitle } from "@/router/utils"
import { BIconChevronRight, BIconXLg } from "bootstrap-icons-vue"

import type { RouteLocationRaw } from "vue-router"

import { tLocales } from "@/i18n"
import en_tabbar from "@/i18n/locales/en/tabbar"
import ko_tabbar from "@/i18n/locales/ko/tabbar"
import zh_tabbar from "@/i18n/locales/zh/tabbar"
const t = tLocales({
  zh: zh_tabbar,
  en: en_tabbar,
  ko: ko_tabbar,
})

const visible = defineModel<boolean>()
const tabStore = useTabsStore()
const tabsMenuList = computed(() => tabStore.tabList)

const handleCloseByIndex = (index: number) => {
  tabStore.closeByIndex(index)
}

const router = useRouter()
const handleGoTo = (r: RouteLocationRaw) => {
  router.push(r)
  visible.value = false
}

const handleRefresh = () => {
  tabStore.refreshTabByIndex(tabStore.activeIndex)
  visible.value = false
}
const handleClose = () => {
  tabStore.closeByIndex(tabStore.activeIndex)
  visible.value = false
}

const handleCloseOthers = () => {
  tabStore.closeOthers(tabStore.activeIndex)
  visible.value = false
}

const handleCloseAll = () => {
  tabStore.closeAll()
  router.push("/")
  visible.value = false
}
</script>
