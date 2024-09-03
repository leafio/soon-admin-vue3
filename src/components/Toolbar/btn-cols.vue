<template>
  <el-tooltip class="btn-item" effect="dark" :content="t('add')" placement="top">
    <el-button ref="buttonRef" v-click-outside="onClickOutside" circle>
      <el-icon>
        <Operation></Operation>
      </el-icon>
    </el-button>
  </el-tooltip>
  <ColsConfig ref="colsRef" v-model="model" :trigger-ref="buttonRef" @reset="emit('reset')" />
</template>
<script setup lang="ts">
import { tMessages } from "@/i18n"
import { Operation } from "@element-plus/icons-vue"
import { Col } from "../cols-config/type"
import { ClickOutside as vClickOutside } from "element-plus"
const emit = defineEmits(["reset"])
const t = tMessages()
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
