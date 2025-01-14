import router from "@/router"
import { defineStore } from "pinia"

import { useKeepAliveStore } from "./keepAlive"
import pinia from "@/store/instance"
import type { RouteLocationNormalized } from "vue-router"

/* TabsState */
interface TabsState {
  tabList: RouteLocationNormalized[]
  activeIndex: number
}

const keepAliveStore = useKeepAliveStore(pinia)

export const useTabsStore = defineStore("tabs", {
  state: (): TabsState => ({
    tabList: [],
    activeIndex: -1,
  }),
  actions: {
    addTabOrSetActiveByRoute(route: RouteLocationNormalized) {
      const targetIndex = this.tabList.findIndex((t) => t.path === route.path)

      if (targetIndex < 0) {
        this.tabList.push({ ...route })
        this.activeIndex = this.tabList.length - 1
      } else {
        this.activeIndex = targetIndex
      }
      if (route.meta?.isKeepAlive) keepAliveStore.addKeepAliveName(route.fullPath)
    },
    closeByIndex(index: number) {
      keepAliveStore.removeKeepAliveName(this.tabList[index].fullPath)
      this.tabList.splice(index, 1)
      if (index < this.activeIndex || index === this.tabList.length) {
        this.activeIndex = this.activeIndex - 1
      }
      nextTick(() => {
        if (this.activeIndex > -1) {
          router.push(this.tabList[this.activeIndex])
        } else {
          router.push("/")
        }
      })
    },
    closeOthers(index: number) {
      const curTab = this.tabList[index]
      this.tabList = [...this.tabList.filter((t) => t.meta.isAffix), curTab]
      this.activeIndex = this.tabList.length - 1

      keepAliveStore.keepAliveNames = this.tabList.filter((t) => t.meta.isKeepAlive).map((t) => t.fullPath)
      router.push(curTab)
    },
    closeAll() {
      this.tabList = []
      this.activeIndex = 0
      keepAliveStore.keepAliveNames = []
      router.push("/")
    },
    refreshTabByIndex(index?: number) {
      const _index = index ?? this.activeIndex
      const curTab = this.tabList[_index]

      keepAliveStore.removeKeepAliveName(curTab.fullPath)
      keepAliveStore.refreshing = true
      nextTick(() => {
        router.push(curTab)
        keepAliveStore.refreshing = false
        if (curTab.meta.isKeepAlive) keepAliveStore.addKeepAliveName(curTab.fullPath)
      })
    },
  },
})
