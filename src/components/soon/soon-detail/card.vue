<template>
  <div class="flex flex-col">
    <slot></slot>
    <div class="transition-all overflow-hidden" :style="{ 'max-height': (expanded ? maxHeight : 0) + 'px' }">
      <el-descriptions ref="refList" direction="horizontal" :column="1" size="small" border>
        <el-descriptions-item v-for="col in cols" :key="col.prop" :label="col.label">
          <template v-if="!col.render">
            {{ readKey(col.prop) }}
          </template>
          <component :is="col.render" v-else :item="item" />
        </el-descriptions-item>
      </el-descriptions>
    </div>
  </div>
</template>
<script setup lang="ts">
import { get } from "lodash-es"
const { cols, item } = defineProps<{
  cols?: {
    label: string
    prop: string
    render?: any
  }[]
  item?: any
}>()

const readKey = computed(() => (key: string) => get(item.value, key))
const expanded = ref(false)
provide("expanded", expanded)

const refList = ref<any>()
const maxHeight = ref(0)
onMounted(() => {
  maxHeight.value = refList.value?.$el.getBoundingClientRect().height ?? 0
  // console.log(refList.value)
  // console.log(maxHeight.value)
})
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
