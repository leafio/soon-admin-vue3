import router from "@/router"
import { defineStore } from "pinia"

import { useKeepAliveStore } from "./keepAlive"
import pinia from "@/store"
import { RouteLocationNormalized } from "vue-router"

/* TabsState */
interface TabsState {
  tabList: RouteLocationNormalized[]
  activeIndex: number
}

const keepAliveStore = useKeepAliveStore(pinia)

export const useTabsStore = defineStore({
  id: "tabs",
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
      this.tabList = [this.tabList[index]]
      this.activeIndex = 0
      const curTab = this.tabList[this.activeIndex]
      keepAliveStore.keepAliveNames = [curTab.fullPath]
      router.push(curTab)
    },
    closeAll() {
      this.tabList = []
      this.activeIndex = 0
      keepAliveStore.keepAliveNames = []
      router.push("/")
    },
    refreshTabByIndex(index: number) {
      const curTab = this.tabList[index]

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
