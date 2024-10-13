<template>
  <el-tooltip class="btn-item" effect="dark" :content="t('export')" placement="top">
    <el-button circle @click="emit('click')">
      <el-icon>
        <Download></Download>
      </el-icon>
    </el-button>
  </el-tooltip>
</template>
<script setup lang="ts">
import { tLocales } from "@/i18n"
import { Download } from "@element-plus/icons-vue"
const emit = defineEmits(["click"])
const t = tLocales({
  zh: {
    export: "导出Excel",
  },
  en: {
    export: "Export Excel",
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
