<template>
  <aside class="">
    <!-- mobile overlay -->
    <div
      :class="`opacity-0  duration-300 transition-opacity
       ${!isHide && isMobile ? ' opacity-100 fixed left-0  w-lvw h-lvh bg-opacity-50 bg-black z-10' : ''}`"
      @click="appStore.sidebar.isHide = true"
    ></div>
    <div
      ref="el"
      :class="` resize-x overflow-auto w-[208px] ${isHide ? ' translate-x-[-208px] ' : isCollapse ? 'w-[50px]' : ''} bg-white dark:bg-neutral-900 z-50   fixed left-0 flex h-svh flex-col border-r   border-solid border-gray-100 dark:border-black transition-transform duration-300 `"
      :style="{ translate: (isHide ? -aside_width : 0) + 'px' }"
    >
      <div class="flex h-12 items-center justify-center">
        <img class="w-8 h-8" src="/logo.svg?url" alt="logo" />
        <span v-show="!isCollapse" class="ml-2 text-lg font-bold">Soon Admin</span>
      </div>
      <el-scrollbar>
        <AsideMenu class="flex-1" :is-collapse="isCollapse" :menus="menus" :selected-path="selectedPath" @item-click="onMenuItemClick"></AsideMenu>
      </el-scrollbar>
    </div>
    <div :class="` transition-[width] duration-300 hidden md:block `" :style="{ width: (isHide ? 0 : isCollapse ? 50 : aside_width) + 'px' }"></div>
  </aside>
</template>
<script setup lang="ts">
import AsideMenu from "./menu/index.vue"

import { useAppStore } from "@/store/modules/app"
import { useUserStore } from "@/store/modules/user"

import type { SoonMenu } from "./menu/type"
import { useResizeObserver } from "@vueuse/core"
import { useMobile } from "@/biz/app/responsive"
const appStore = useAppStore()
const isHide = computed(() => appStore.sidebar.isHide)
const isCollapse = computed(() => appStore.sidebar.isCollapse)

const { isMobile } = useMobile()
watchEffect(() => {
  appStore.sidebar.isHide = isMobile.value
})

const el = ref(null)
const text = ref("")
const aside_width = ref(208)

useResizeObserver(el, (entries) => {
  const entry = entries[0]
  const { width, height } = entry.contentRect
  text.value = `width: ${width}, height: ${height}`
  console.log("size", width, height)
  aside_width.value = width
})

const route = useRoute()
const userStore = useUserStore()
const filterChildrenNotHide = (arr?: any[]): any[] | undefined => {
  if (Array.isArray(arr)) {
    return arr.filter((a) => !a.meta?.isHide).map((a) => ({ ...a, children: filterChildrenNotHide(a.children) }))
  }
  return undefined
}
const menus = computed(() => {
  return (filterChildrenNotHide(userStore.menus) ?? []) as SoonMenu[]
})

const selectedPath = ref("")
watchEffect(() => {
  selectedPath.value = route.path
})
const router = useRouter()
const onMenuItemClick = (menu: SoonMenu) => {
  if (isMobile.value) appStore.sidebar.isHide = true
  if (!menu.meta.isIframe && menu.meta?.link) return window.open(menu.meta?.link, "_blank")
  // if (selectedPath) selectedPath.value = menu.path
  // router.push(menu.path)
}
</script>
