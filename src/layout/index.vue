<template>
  <div class="flex">
    <aside
      ref="refAside"
      :class="`w-[208px] ${isHide ? ' translate-x-[-208px] ' : ''}  bg-white z-50   fixed left-0 flex h-svh flex-col border-r border-solid border-gray-100 transition-transform duration-300 `"
    >
      <div class="flex h-12 items-center justify-center">
        <img class="w-8 h-8" src="@/assets/images/logo.svg?url" alt="logo" />
        <span v-show="!isHide" class="ml-4 text-lg font-bold">{{ title }}</span>
      </div>
      <Menu class="flex-1" />
    </aside>
    <div :class="` transition-[width] duration-300 hidden md:block ${isHide ? 'w-0' : 'w-[208px]'}`"></div>
    <main class="flex-1 overflow-x-hidden h-screen flex flex-col">
      <Header />
      <TabBar class="border-t border-solid border-gray-100" />
      <router-view v-slot="{ Component, route }">
        <KeepComp :curr-comp="Component" :curr-route="route" :refreshing="refreshing" />
        <transition appear name="fade-transform" mode="out-in">
          <keep-alive :include="keepAliveNames">
            <component :is="createComponentWrapper(Component, route)" v-if="!refreshing && !(route.meta?.link && route.meta?.isIframe)" :key="route.fullPath" />
          </keep-alive>
        </transition>
      </router-view>
      <footer></footer>
    </main>
  </div>
</template>
<script setup lang="ts">
import Menu from "./components/menu/index.vue"
import Header from "./components/header/index.vue"
import TabBar from "./components/tab-bar/index.vue"
import KeepComp from "./components/keep-comp/index.vue"

import { useKeepAliveStore } from "@/store/modules/keepAlive"
import { storeToRefs } from "pinia"
import { useAppStore } from "@/store/modules/app"

const keepAliveStore = useKeepAliveStore()
const { keepAliveNames, refreshing } = storeToRefs(keepAliveStore)
// 解决详情页 keep-alive 问题
const wrapperMap = new Map()
function createComponentWrapper(component: any, route: { fullPath: any }) {
  if (!component) return
  const wrapperName = route.fullPath
  let wrapper = wrapperMap.get(wrapperName)
  if (!wrapper) {
    wrapper = { name: wrapperName, render: () => h(component) }
    wrapperMap.set(wrapperName, wrapper)
  }
  return h(wrapper)
}

const refAside = ref(null)
const appStore = useAppStore()

const isHide = computed(() => appStore.sideBar.isHide)
const title = computed(() => appStore.sideBar.title)
const isMobile = computed(() => appStore.responsive === "mobile")

import { onClickOutside } from "@vueuse/core"
if (isMobile.value) {
  appStore.sideBar.isHide = true
}
onClickOutside(refAside, (event) => {
  if (isMobile.value) appStore.sideBar.isHide = true
})
</script>
