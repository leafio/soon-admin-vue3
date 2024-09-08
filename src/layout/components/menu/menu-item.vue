<template>
  <li :class="{ current: hasSelect && !level, isCollapse }">
    <div
      class="flex-1 flex items-center justify-between mx-1 rounded menu cursor-pointer h-[3em] mt-1"
      :class="{ active: menu.path === selectedPath, base: !level }"
      :style="`padding-left: calc(${(level ?? 0) * 16}px + 0.5rem)`"
      @click="handleClickMenu"
    >
      <div class="flex flex-1">
        <soon-icon v-if="!level && menu.meta?.icon" :value="menu.meta.icon" class="w-6 h-6" />
        <span v-if="!isCollapse">{{ runStrFun(menu.meta?.title) }}</span>
      </div>

      <div v-if="!isCollapse && menu.children?.length" class="mx-2">
        <BIconChevronLeft class="transition-transform" :class="{ '-rotate-90': expanded }" />
      </div>
    </div>
    <ul v-if="expanded && !isCollapse">
      <menu-item v-for="sub in menu.children ?? []" :key="sub.path" :menu="sub" :level="(level ?? 0) + 1" />
    </ul>
  </li>
</template>

<script setup lang="ts">
import SoonIcon from "@/components/soon-icon/index.vue"
import { runStrFun } from "@/utils"
import { Menu } from "@/api"
import { BIconChevronLeft } from "bootstrap-icons-vue"
import { useAppStore } from "@/store/modules/app"

const props = defineProps<{ menu: Menu; level?: number }>()
const router = useRouter()

const expanded = ref(false)
const selectedPath = inject<Ref<string>>("selectedPath")
const isCollapse = inject("isCollapse")
const appStore = useAppStore()

const handleClickMenu = () => {
  const menu = props.menu
  if (menu.children?.length) {
    expanded.value = !expanded.value
  } else {
    if (appStore.responsive === "mobile") appStore.sideBar.isHide = true
    if (!menu.meta.isIframe && menu.meta?.link) return window.open(menu.meta?.link, "_blank")
    if (selectedPath) selectedPath.value = menu.path
    router.push(menu.path)
  }
}
const hasPath = (item: Menu, path: string): boolean => {
  if (item.redirect === path || item.path === path) return true
  return (
    item.children?.some((ch) => {
      if (ch.path === path) return true
      return hasPath(ch, path)
    }) ?? false
  )
}
const hasSelect = computed(() => hasPath(props.menu, selectedPath?.value ?? ""))

watch(
  () => selectedPath?.value,
  () => {
    if (hasSelect.value) expanded.value = true
  },
  { immediate: true },
)
</script>

<style scoped>
.current {
  border-right: solid 1px var(--el-menu-hover-text-color);
}
.current .base {
  color: var(--el-menu-hover-text-color);
}

@media screen and (min-width: 768px) {
  .menu:hover {
    color: var(--el-menu-hover-text-color);
    background-color: var(--el-menu-hover-bg-color);
  }
}
.menu.active {
  color: white;
  background-color: var(--el-color-primary);
}

.isCollapse > div {
  justify-content: center;
}
</style>
