<template>
  <el-tooltip class="btn-item" effect="dark" :content="t('cols')" placement="top">
    <el-button ref="buttonRef" v-click-outside="onClickOutside" circle>
      <el-icon>
        <Operation></Operation>
      </el-icon>
    </el-button>
  </el-tooltip>
  <soon-cols ref="colsRef" v-model="model" :trigger-ref="buttonRef" @reset="emit('reset')" />
</template>
<script setup lang="ts">
import { tLocales } from "@/i18n"
import { Operation } from "@element-plus/icons-vue"
import type { Col } from "@/components/soon/soon-cols/type"
import { ClickOutside as vClickOutside } from "element-plus"
import SoonCols from "@/components/soon/soon-cols/index.vue"
const emit = defineEmits(["reset"])
const t = tLocales()
const model = defineModel<Col[]>({ default: [] })

const buttonRef = ref()
const colsRef = ref()
const onClickOutside = () => {
  unref(colsRef.value.popoverRef).popperRef?.delayHide?.()
}
</script>
<style lang="scss" scoped>
:deep(.el-button) {
  & i.el-icon {
    margin-right: 0 !important;
  }
}
</style>
