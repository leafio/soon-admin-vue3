<template>
  <header class="flex justify-between p-2 app-header">
    <div class="flex items-center">
      <BIconTextIndentLeft v-if="isHide" class="w-6 h-6 cursor-pointer" @click="toggleSideMenu" />
      <BIconTextIndentRight v-else class="w-6 h-6 cursor-pointer" @click="toggleSideMenu" />
      <Breadcrumb class="ml-4" />
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
      <User />
    </div>
  </header>
</template>
<script setup lang="ts">
import { BIconGear } from "bootstrap-icons-vue"
import { BIconSearch } from "bootstrap-icons-vue"
import { BIconBell } from "bootstrap-icons-vue"
import { BIconTextIndentLeft, BIconTextIndentRight } from "bootstrap-icons-vue"

import Breadcrumb from "./Breadcrumb.vue"
import LangSwitch from "../lang-switch.vue"
import User from "./user.vue"
import { useAppStore } from "@/store/modules/app"

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
</style>
