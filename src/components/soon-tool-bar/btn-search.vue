<template>
  <el-tooltip class="btn-item" effect="dark" :content="showSearch ? t('hide') : t('show')" placement="top">
    <el-button circle @click="toggleSearch()">
      <el-icon>
        <Search></Search>
      </el-icon>
    </el-button>
  </el-tooltip>
</template>
<script setup lang="ts">
import { tLocales } from "@/i18n"
import { Search } from "@element-plus/icons-vue"
const showSearch = defineModel<boolean>()
const toggleSearch = () => {
  showSearch.value = !showSearch.value
}
const t = tLocales({
  zh: {
    hide: "隐藏搜索",
    show: "显示搜索",
  },
  en: {
    hide: "Hide Search Section",
    show: "Show Search Section",
  },
})
</script>
<style lang="scss" scoped>
:deep(.el-button) {
  & i.el-icon {
    margin-right: 0 !important;
  }
}
</style>
