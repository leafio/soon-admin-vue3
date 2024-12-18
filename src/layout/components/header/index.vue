<template>
  <header class="flex justify-between p-2 app-header">
    <div class="flex items-center">
      <BIconTextIndentLeft v-if="isHide" class="soon-header-menu-icon" @click="toggleSideMenu" />
      <BIconTextIndentRight v-else class="soon-header-menu-icon" @click="toggleSideMenu" />
      <Breadcrumb class="ml-4" />
    </div>
    <div class="hidden md:flex mx-6">
      <el-alert :title="t('msg')" type="warning" class="!py-1 !pr-16" />
    </div>

    <div class="flex items-center">
      <LangSwitch class="mr-4" />
      <!-- <div class="mr-4 cursor-pointer hidden md:block">
        <BIconSearch />
      </div>
      <div class="mr-4 cursor-pointer hidden md:block">
        <BIconGear />
      </div>
      <div class="mr-4 cursor-pointer hidden md:block">
        <BIconBell />
      </div> -->
      <a href="https://github.com/leafio/soon-admin-vue3" target="_blank">
        <el-tooltip :content="t('star')">
          <BIconGithub class="mr-4" />
        </el-tooltip>
      </a>

      <User />
    </div>
  </header>
</template>
<script setup lang="ts">
import { BIconGear } from "bootstrap-icons-vue"
import { BIconSearch } from "bootstrap-icons-vue"
import { BIconBell } from "bootstrap-icons-vue"
import { BIconTextIndentLeft, BIconTextIndentRight, BIconGithub } from "bootstrap-icons-vue"

import Breadcrumb from "./soon-breadcrumb.vue"
import LangSwitch from "../lang-switch.vue"
import User from "./user.vue"
import { useAppStore } from "@/store/modules/app"
import { tLocales } from "@/i18n"

const t = tLocales({
  zh: { msg: "我在上海找工作，如果有机会给到我，请联系我，email: leafnote@outlook.com ", star: "给个⭐" },
  en: { msg: "I'm looking for job in Shanghai, if you have a offer for me , email me : leafnote@outlook.com ", star: "⭐ me" },
})

const appStore = useAppStore()
const isHide = computed(() => appStore.sideBar.isHide)
const toggleSideMenu = () => {
  appStore.sideBar.isHide = !appStore.sideBar.isHide
}
</script>
<style scoped>
.app-header .cursor-pointer:hover svg {
  animation: logoAnimation 0.3s ease-in-out;
}

.soon-header-menu-icon {
  @apply w-8 h-8 cursor-pointer p-1 rounded-sm;
  color: var(--soon-menu-hover-text-color);
  background-color: var(--soon-menu-hover-bg-color);
}
</style>
