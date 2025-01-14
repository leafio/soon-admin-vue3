<template>
  <header class="flex justify-between p-2 app-header">
    <div class="flex items-center" @click="toggleSideMenu">
      <BIconTextIndentLeft v-if="isHide" class="soon-header-menu-icon" />
      <BIconTextIndentRight v-else class="soon-header-menu-icon" />
      <Breadcrumb class="ml-4" />
    </div>

    <div class="flex items-center">
      <div class="mr-4 cursor-pointer hidden md:block" @click="toggleFullscreen">
        <BIconFullscreenExit v-if="isFullscreen" />
        <BIconFullscreen v-else />
      </div>
      <LangSwitch class="mr-4 cursor-pointer" />

      <div class="mr-4 cursor-pointer hidden md:block" @click="toggleDark()">
        <BIconMoon v-if="isDark" />
        <BIconSun v-else />
      </div>

      <!-- <div class="mr-4 cursor-pointer hidden md:block">
        <BIconSearch />
      </div>

      <div class="mr-4 cursor-pointer hidden md:block">
        <BIconBell />
      </div> -->
      <div class="mr-4 cursor-pointer hidden md:block select-none" @click="showSettingsDrawer = !showSettingsDrawer">
        <BIconGear />
      </div>
      <a class="cursor-pointer" href="https://github.com/leafio/soon-admin-vue3" target="_blank">
        <BIconGithub class="mr-4" />
      </a>
      <User />
    </div>
    <Settings v-model="showSettingsDrawer" />
  </header>
</template>
<script setup lang="ts">
import { BIconFullscreen, BIconGear, BIconFullscreenExit, BIconSun, BIconMoon } from "bootstrap-icons-vue"
import { BIconTextIndentLeft, BIconTextIndentRight, BIconGithub } from "bootstrap-icons-vue"

import Breadcrumb from "./breadcrumb.vue"
import Settings from "./settings.vue"
import User from "./user.vue"
import LangSwitch from "@/components/lang-switch.vue"

import { tLocales } from "@/i18n"
import { useDark, useFullscreen, useToggle } from "@vueuse/core"
import { useAppStore } from "@/store/modules/app"

const appStore = useAppStore()
const isHide = computed(() => appStore.sidebar.isHide)
const toggleSideMenu = () => {
  appStore.sidebar.isHide = !appStore.sidebar.isHide
}

const { isFullscreen, enter, exit, toggle: toggleFullscreen } = useFullscreen()

const isDark = useDark()

const toggleDark = useToggle(isDark)

const showSettingsDrawer = ref(false)
</script>
<style>
.app-header .cursor-pointer:hover svg {
  animation: logoAnimation 0.3s ease-in-out;
}

.soon-header-menu-icon {
  @apply w-8 h-8 cursor-pointer p-1 rounded-sm text-primary-600 bg-primary-100;
}
</style>
