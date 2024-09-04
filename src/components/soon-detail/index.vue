<template>
  <el-collapse>
    <el-collapse-item>
      <template #title>
        <slot></slot>
      </template>
      <el-descriptions direction="horizontal" :column="1" size="small" border>
        <el-descriptions-item v-for="col in list" :key="col.prop" :label="col.label">
          <template v-if="!col.render">
            {{ readKey(col.prop) }}
          </template>
          <component :is="col.render" v-else :item="item" />
        </el-descriptions-item>
      </el-descriptions>
    </el-collapse-item>
  </el-collapse>
</template>
<script setup lang="ts">
import { get } from "lodash-es"
const props = defineProps<{
  cols?: {
    label: string
    prop: string
    render?: any
  }[]
  item?: any
}>()
const { cols, item } = toRefs(props)
const list = computed(() => unref(cols))
const readKey = computed(() => (key: string) => get(item.value, key))
</script>
<style scoped>
:deep(.el-collapse-item__header) {
  line-height: initial;
  height: initial;
  font-weight: initial;
  /* border-top:0px; */
}

.el-collapse {
  border: none;
}
</style>
