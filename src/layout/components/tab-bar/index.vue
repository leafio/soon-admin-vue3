<template>
  <nav class="h-fit w-full bg-white">
    <div ref="tabContainerRef" v-click-outside="onClickOutside" v-scroll class="flex w-full" @wheel.prevent="onHandleScroll">
      <nav-tab
        v-for="(item, index) in tabsMenuList"
        :key="index"
        :ref="(el) => mapRefList(el, index)"
        :label="runStrFun(item.meta?.title)"
        :active="tabStore.activeIndex === index"
        :closable="!item.meta.isAffix"
        @close="handleCloseByIndex(index)"
        @contextmenu.prevent="showContext(index)"
        @click="handleGoTo(item)"
      />
    </div>
    <context-menu v-if="tabsMenuList[curIndex]" :visible="visible" :target-ref="targetRefList[curIndex]" :tab="tabsMenuList[curIndex]" :cur-index="curIndex" />
  </nav>
</template>

<script setup lang="ts">
import Sortable from "sortablejs"
import { ref, computed, watch, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useTabsStore } from "@/store/modules/tabs"
import { ClickOutside as vClickOutside } from "element-plus"
import NavTab from "./nav-tab.vue"
import { RouteLocationRaw } from "vue-router"
import { runStrFun } from "@/utils"
import { useAppStore } from "@/store/modules/app"
import { useUserStore } from "@/store/modules/user"
import contextMenu from "./context-menu.vue"
import { unrefElement } from "@vueuse/core"

const tabContainerRef = ref<HTMLElement | null>(null)
const visible = ref(false)
const targetRefList = ref<Element[]>([])
const mapRefList = (el: any, index: number) => {
  if (el) targetRefList.value[index] = el
}

const curIndex = ref(-1)

const showContext = (index: number) => {
  curIndex.value = index
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
      if (el) tabContainerRef.value?.scrollTo({ left: unrefElement(el as any)?.getBoundingClientRect().left })
    })
  },
)
// 鼠标滚轮滚动
const onHandleScroll = (e: any) => {
  if (tabContainerRef.value) tabContainerRef.value.scrollLeft += e.deltaY / 4
}

const handleGoTo = (r: RouteLocationRaw) => {
  router.push(r)
}

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
