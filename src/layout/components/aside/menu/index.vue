<template>
  <ul>
    <menu-item v-for="menu in menus ?? []" :key="menu.path" :menu="menu" @item-click="handleItemClick" />
  </ul>
</template>
<script setup lang="ts">
import menuItem from "./menu-item.vue"
import type { SoonMenu } from "./type"
const props = defineProps<{
  isCollapse?: boolean
  menus: SoonMenu[]
  selectedPath: string
}>()
const emit = defineEmits<{
  "item-click": [menu: SoonMenu]
}>()

const handleItemClick = (item: SoonMenu) => {
  emit("item-click", item)
}
const selectedPath = computed(() => props.selectedPath)
provide("selectedPath", selectedPath)
const isCollapse = computed(() => props.isCollapse)
provide("isCollapse", isCollapse)
</script>
