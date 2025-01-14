<template>
  <div class="flex">
    <Aside />
    <main class="flex-1 overflow-x-hidden h-screen flex flex-col">
      <Header v-show="!isHeaderHide" />
      <TabBar v-if="!isTabbarHide" class="border-t border-solid border-gray-100 dark:border-black px-1" />
      <router-view v-slot="{ Component, route }">
        <IframeKeepAlive
          :comp="Component"
          :name="route.fullPath"
          :iframe-src="route.meta.link"
          :is-keep-alive="route.meta.isKeepAlive"
          :names="keepAliveNames"
          :refreshing="refreshing"
        />
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

import IframeKeepAlive from "./components/iframe-keep-alive/index.vue"
import Aside from "./components/aside/index.vue"

import { storeToRefs } from "pinia"
import { useKeepAliveStore } from "@/store/modules/keepAlive"

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

const appStore = useAppStore()

const isHeaderHide = computed(() => appStore.header.isHide)
const isTabbarHide = computed(() => appStore.tabbar.isHide)
</script>
