<template>
  <aside>
    <div
      :class="`opacity-0  duration-300 transition-opacity ${!isHide && isMobile ? ' opacity-100 fixed left-0  w-lvw h-lvh bg-opacity-50 bg-black z-[1]' : ''}`"
      @click="appStore.sideBar.isHide = true"
    ></div>
    <div
      ref="refAside"
      :class="`w-[208px] ${isHide ? ' translate-x-[-208px] ' : isCollapse ? 'w-[50px]' : ''}  bg-white z-50   fixed left-0 flex h-svh flex-col border-r border-solid border-gray-100 transition-transform duration-300 `"
    >
      <!-- <BIconPin class="absolute left-0 top-0 w-6 h-6 p-1 cursor-pointer" @click="appStore.sideBar.isCollapse = !isCollapse" /> -->
      <div class="flex h-12 items-center justify-center">
        <img class="w-8 h-8" src="/logo.svg?url" alt="logo" />
        <span v-show="!isCollapse" class="ml-2 text-lg font-bold">Soon Admin</span>
      </div>
      <Menu class="flex-1" :is-collapse="isCollapse" />
    </div>
    <div :class="` transition-[width] duration-300 hidden md:block ${isHide ? 'w-0' : isCollapse ? 'w-[50px]' : 'w-[208px]'}`"></div>
  </aside>
</template>
<script setup lang="ts">
import { useAppStore } from "@/store/modules/app"
import { BIconPin } from "bootstrap-icons-vue"
import Menu from "./menu/index.vue"
const appStore = useAppStore()
const isHide = computed(() => appStore.sideBar.isHide)
const isCollapse = computed(() => appStore.sideBar.isCollapse)

const isMobile = computed(() => appStore.responsive === "mobile")

const refAside = ref(null)

// import { onClickOutside } from "@vueuse/core"
if (isMobile.value) {
  appStore.sideBar.isHide = true
}
watch(isMobile, () => (appStore.sideBar.isHide = isMobile.value))
// onClickOutside(refAside, () => {
//   if (isMobile.value) appStore.sideBar.isHide = true
// })
</script>
