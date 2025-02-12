<template>
  <el-tooltip class="btn-item" effect="dark" :content="t('refresh')" placement="top" trigger="click">
    <el-button circle @click="emit('click')">
      <el-icon> <Refresh></Refresh> </el-icon
    ></el-button>
  </el-tooltip>
</template>
<script setup lang="ts">
import { tLocales } from "@/i18n"
import { Refresh } from "@element-plus/icons-vue"
const emit = defineEmits(["click"])
const t = tLocales()
</script>
<style lang="scss" scoped>
:deep(.el-button) {
  & i.el-icon {
    margin-right: 0 !important;
  }
}
</style>
