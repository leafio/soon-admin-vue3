<template>
  <ul>
    <menu-item v-for="menu in menus ?? []" :key="menu.path" :menu="menu" @item-click="handleItemClick" />
  </ul>
</template>
<script setup lang="ts">
import type { Menu } from "@/api"
import menuItem from "./menu-item.vue"
const props = defineProps<{
  isCollapse?: boolean
  menus: Menu[]
  selectedPath: string
}>()
const emit = defineEmits<{
  "item-click": [menu: Menu]
}>()

const handleItemClick = (item: Menu) => {
  emit("item-click", item)
}
const selectedPath = computed(() => props.selectedPath)
provide("selectedPath", selectedPath)
const isCollapse = computed(() => props.isCollapse)
provide("isCollapse", isCollapse)
</script>
