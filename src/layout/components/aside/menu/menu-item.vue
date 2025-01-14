<template>
  <li :class="{ current: hasSelect && !level, isCollapse }">
    <component
      :is="menu.children?.length || (menu.meta?.link && !menu.meta.isIframe) ? 'div' : RouterLink"
      class="flex-1 flex items-center justify-between mx-1 rounded menu cursor-pointer h-[3em] mt-1"
      :class="{ active: menu.path === selectedPath, base: !level }"
      :style="`padding-left: calc(${(level ?? 0) * 16}px + 0.5rem)`"
      :to="menu.path"
      @click="handleClickMenu(menu)"
    >
      <div class="flex flex-1">
        <soon-icon v-if="!level && menu.meta?.icon" :value="menu.meta.icon" class="w-6 h-6" />
        <span v-if="!isCollapse" class="ml-1">{{ showMenuTitle(menu.meta?.title) }}</span>
      </div>

      <div v-if="!isCollapse && menu.children?.length" class="mx-2">
        <BIconChevronLeft class="transition-transform" :class="{ '-rotate-90': expanded }" />
      </div>
    </component>
    <ul v-if="expanded && !isCollapse">
      <menu-item v-for="sub in menu.children ?? []" :key="sub.path" :menu="sub" :level="(level ?? 0) + 1" @item-click="handleClickMenu" />
    </ul>
  </li>
</template>

<script setup lang="ts">
import { BIconChevronLeft } from "bootstrap-icons-vue"
import SoonIcon from "@/components/soon/soon-icon/index.vue"

import type { Menu } from "@/api"
import { showMenuTitle } from "@/router/utils"
import { RouterLink } from "vue-router"

const props = defineProps<{ menu: Menu; level?: number }>()

const emit = defineEmits(["item-click"])

const expanded = ref(false)
const selectedPath = inject<Ref<string>>("selectedPath")
const isCollapse = inject("isCollapse")

const handleClickMenu = (menu?: any) => {
  const _menu = menu ?? props.menu
  if (_menu.children?.length) {
    expanded.value = !expanded.value
  } else {
    emit("item-click", _menu)
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
watchEffect(() => {
  if (hasSelect.value) expanded.value = true
})
</script>

<style scoped>
.current {
  @apply border-primary-600 border-r;
}

.current .base {
  @apply text-primary-600;
  font-weight: bold;
}

.menu:hover {
  @apply text-primary-600 bg-primary-100;
}

.menu.active {
  color: white;
  @apply bg-primary-600;
}

.isCollapse > div {
  justify-content: center;
}
</style>
