<template>
  <div class="flex items-center text-sm">
    <template v-for="(item, index) in breadcrumbList" :key="item.path">
      <div class="flex items-center" @click="onBreadcrumbClick(item, index)">
        <soon-icon v-if="item.meta.icon" :value="item.meta.icon" class="w-4 h-4 mr-0.5" />
        <span class="text-nowrap">{{ showMenuTitle(item.meta.title) }}</span>
      </div>
      <BIconChevronRight
        v-if="index <= breadcrumbList.length - 1 && showMenuTitle(breadcrumbList[index + 1]?.meta.title)"
        class="w-4 h-4 mx-1.5 text-gray-600"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router"
import { BIconChevronRight } from "bootstrap-icons-vue"
import SoonIcon from "@/components/soon/soon-icon/index.vue"
import type { RouteLocationRaw } from "vue-router"
import { showMenuTitle } from "@/router/utils"

const route = useRoute()
// const router = useRouter()

const breadcrumbList = computed(() => {
  // console.log('route.matched',route.matched)
  return route.matched.filter((r) => r.meta.title)
})

// Click Breadcrumb
const onBreadcrumbClick = (item: { path: RouteLocationRaw }, index: number) => {
  // if (index !== breadcrumbList.value.length - 1) router.push(item.path)
}
</script>

<style scoped lang="scss"></style>
