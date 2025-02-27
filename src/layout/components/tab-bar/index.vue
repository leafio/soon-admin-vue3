<template>
  <nav class="h-fit w-full bg-white dark:bg-neutral-900 flex" @wheel.prevent="onHandleScroll">
    <el-scrollbar ref="scrollRef" class="flex-1">
      <div ref="tabContainerRef" class="flex">
        <nav-tab
          v-for="(item, index) in tabsMenuList"
          :key="index"
          :ref="(el) => mapRefList(el, index)"
          v-click-outside="onClickOutside"
          :label="showMenuTitle(item.meta?.title)"
          :active="tabStore.activeIndex === index"
          :closable="!item.meta.isAffix"
          @close="handleCloseByIndex(index)"
          @contextmenu.prevent="showContext(index)"
          @click="handleGoTo(item)"
        />
      </div>
    </el-scrollbar>

    <div class="h-full flex justify-center items-center cursor-pointer mx-1" @click="handleRefresh">
      <BIconArrowClockwise class="w-6 h-6 p-1 rounded hover:bg-primary-100" />
    </div>
    <div class="h-full flex justify-center items-center cursor-pointer mx-1" @click="handleToggleFullscreen">
      <BIconFullscreenExit v-if="isContentFullscreen" class="w-6 h-6 p-1 rounded-full hover:bg-primary-100" />
      <BIconFullscreen v-else class="w-6 h-6 p-1 rounded hover:bg-primary-100" />
    </div>
    <div class="md:hidden h-full flex justify-center items-center cursor-pointer mx-1" @click="mobileContextVisible = true">
      <BIconThreeDotsVertical class="w-6 h-6 p-1 rounded hover:bg-primary-100" />
    </div>

    <context-menu v-if="tabsMenuList[curIndex]" :visible="visible" :target-ref="targetRefList[curIndex]" :tab="tabsMenuList[curIndex]" :cur-index="curIndex" />
    <MobileContext v-model="mobileContextVisible" />
  </nav>
</template>

<script setup lang="ts">
import Sortable from "sortablejs"
import { ref, computed, watch, onMounted } from "vue"
import type { RouteLocationRaw } from "vue-router"
import { useRoute, useRouter } from "vue-router"

import { ElScrollbar, ClickOutside as vClickOutside } from "element-plus"
import NavTab from "./nav-tab.vue"
import MobileContext from "./mobile-context.vue"
import contextMenu from "./context-menu.vue"
import { unrefElement } from "@vueuse/core"
import { BIconThreeDotsVertical, BIconArrowClockwise, BIconFullscreenExit, BIconFullscreen } from "bootstrap-icons-vue"

import { showMenuTitle } from "@/router/utils"
import { useTabsStore } from "@/store/modules/tabs"
import { useAppStore } from "@/store/modules/app"
import { useUserStore } from "@/store/modules/user"
import { useKeepAliveStore } from "@/store/modules/keepAlive"
import { useMobile } from "@/biz/app/responsive"

const tabContainerRef = ref<HTMLElement | null>(null)
const scrollRef = ref<InstanceType<typeof ElScrollbar> | null>(null)
const visible = ref(false)
const targetRefList = ref<Element[]>([])
const mapRefList = (el: any, index: number) => {
  if (el) targetRefList.value[index] = el
}

const curIndex = ref(-1)

const showContext = (index?: number) => {
  if (index !== undefined) {
    curIndex.value = index
  } else {
    curIndex.value = tabStore.activeIndex
  }
  visible.value = true
}
const onClickOutside = () => {
  visible.value = false
}

const route = useRoute()
const router = useRouter()
const tabStore = useTabsStore()
const appStore = useAppStore()
const userStore = useUserStore()
const keepaliveStore = useKeepAliveStore()

onUnmounted(() => {
  tabStore.$reset()
  keepaliveStore.$reset()
})

const addAffixRoute = (routes: any[] | undefined) => {
  routes?.forEach((item) => {
    if (item.meta?.isAffix) {
      tabStore.addTabOrSetActiveByRoute({ ...item, fullPath: item.path } as any)
    }
    if (item.children) addAffixRoute(item.children)
  })
}

// 初始化需要固定的 tabs
const initTabs = () => {
  addAffixRoute(userStore.menus)
}
initTabs()
watch(
  () => route.fullPath,
  () => {
    tabStore.addTabOrSetActiveByRoute(route)
  },
  { immediate: true },
)
watch(
  () => tabStore.tabList.length,
  () => {
    nextTick(() => {
      if (tabStore.tabList.length === 0 && appStore.route.homeUrl === route.path) {
        tabStore.addTabOrSetActiveByRoute(route)
        tabStore.refreshTabByIndex(0)
      }
    })
  },
)
const handleCloseByIndex = (index: number) => {
  tabStore.closeByIndex(index)
}

watch(
  () => tabStore.activeIndex,
  () => {
    nextTick(() => {
      const el = targetRefList.value[tabStore.activeIndex]
      // if (el) tabContainerRef.value?.scrollTo({ left: unrefElement(el as any)?.getBoundingClientRect().left })
      if (el) scrollRef.value?.scrollTo({ left: unrefElement(el as any)?.getBoundingClientRect().left })
    })
  },
)
// 鼠标滚轮滚动
const onHandleScroll = (e: any) => {
  // if (tabContainerRef.value) tabContainerRef.value.scrollLeft += e.deltaY / 4
  console.log(scrollRef.value?.wrapRef)
  if (scrollRef.value) scrollRef.value.wrapRef!.scrollLeft += e.deltaY / 4
}

const handleGoTo = (r: RouteLocationRaw) => {
  router.push(r)
}

const handleRefresh = () => {
  tabStore.refreshTabByIndex()
}

const isContentFullscreen = computed(() => {
  return appStore.header.isHide && appStore.sidebar.isHide
})

const { isMobile } = useMobile()
const handleToggleFullscreen = () => {
  if (isContentFullscreen.value) {
    appStore.header.isHide = false
    if (!isMobile.value) appStore.sidebar.isHide = false
  } else {
    appStore.header.isHide = true
    appStore.sidebar.isHide = true
  }
}
const mobileContextVisible = ref(false)

//-------
//拖动排序
const tabsMenuList = computed(() => tabStore.tabList)

onMounted(() => {
  tabsDrop()
})

// tabs 拖拽排序
const tabsDrop = () => {
  if (tabContainerRef.value)
    Sortable.create(tabContainerRef.value, {
      draggable: ".tab",
      animation: 300,
      onEnd({ newIndex, oldIndex }) {
        const tabsList = [...tabStore.tabList]
        const currRow = tabsList.splice(oldIndex as number, 1)[0]
        tabsList.splice(newIndex as number, 0, currRow)
      },
    })
}
</script>
