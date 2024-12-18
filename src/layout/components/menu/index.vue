<template>
  <el-scrollbar>
    <ul>
      <menu-item v-for="menu in menus ?? []" :key="menu.path" :menu="menu" />
    </ul>
  </el-scrollbar>
</template>
<script setup lang="ts">
import { useUserStore } from "@/store/modules/user"
import menuItem from "./menu-item.vue"
const props = defineProps<{
  isCollapse?: boolean
}>()

const route = useRoute()
const userStore = useUserStore()
const filterChildrenNotHide = (arr?: any[]): any[] | undefined => {
  if (Array.isArray(arr)) {
    return arr.filter((a) => !a.meta?.isHide).map((a) => ({ ...a, children: filterChildrenNotHide(a.children) }))
  }
  return undefined
}
const menus = computed(() => {
  return filterChildrenNotHide(userStore.menus)
})

const selectedPath = ref("")
watchEffect(() => {
  selectedPath.value = route.path
})
provide("selectedPath", selectedPath)
const isCollapse = computed(() => props.isCollapse)
provide("isCollapse", isCollapse)
</script>
