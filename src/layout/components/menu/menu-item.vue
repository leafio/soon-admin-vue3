<template>
  <li
    class="menu flex cursor-pointer h-[3em]"
    :style="`padding-left:${(level ?? 0) * 16}px`"
    :class="{ current: hasSelect && !level, isCollapse, base: !level }"
    @click="handleClickMenu"
  >
    <div class="flex-1 flex items-center justify-between" :class="{ active: menu.path === selectedPath }">
      <div class="flex">
        <soon-icon v-if="!level && menu.meta?.icon" :value="menu.meta.icon" class="w-6 h-6" />
        <span v-if="!isCollapse">{{ runStrFun(menu.meta?.title) }}</span>
      </div>

      <div v-if="!isCollapse && menu.children?.length" class="mx-2">
        <BIconChevronLeft class="transition-transform" :class="{ '-rotate-90': expanded }" />
      </div>
    </div>
  </li>
  <template v-if="expanded && !isCollapse">
    <menu-item v-for="sub in menu.children ?? []" :key="sub.path" :menu="sub" :level="(level ?? 0) + 1" />
  </template>
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
  background-color: var(--el-menu-hover-bg-color);
  color: var(--el-menu-hover-text-color);
}

.active {
  color: var(--el-menu-hover-text-color);
  font-weight: bold;
}

.menu:hover {
  color: var(--el-menu-hover-text-color);
  background-color: var(--el-menu-hover-bg-color);
}

.menu.base {
  &::before {
    content: "";
    width: 4px;
    margin-right: 4px;
  }
}

.menu.current::before {
  background-color: var(--el-menu-hover-text-color);
}

.menu.current.isCollapse::before {
  display: none;
}

.isCollapse > div {
  justify-content: center;
}
</style>
