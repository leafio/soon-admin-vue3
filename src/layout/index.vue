<template>
  <div class="flex">
    <soon-aside />
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
import Header from "./components/header/index.vue"
import TabBar from "./components/tab-bar/index.vue"
import KeepComp from "./components/keep-comp/index.vue"
import soonAside from "./components/soon-aside.vue"

import { useKeepAliveStore } from "@/store/modules/keepAlive"
import { storeToRefs } from "pinia"

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
</script>
