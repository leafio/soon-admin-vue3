<template>
  <div class="flex flex-col">
    <slot></slot>
    <div class="flex justify-between p-1">
      <slot name="action"></slot>
      <BIconChevronLeft
        class="transition-transform bg-primary-100 rounded-full w-6 h-6 p-1 text-primary-700 stroke-2 cursor-pointer"
        :class="{ '-rotate-90': expanded }"
        @click="expanded = !expanded"
      />
    </div>
    <div class="transition-all overflow-hidden" :style="{ 'max-height': (expanded ? maxHeight : 0) + 'px' }">
      <el-descriptions ref="refList" direction="horizontal" :column="1" size="small" border>
        <el-descriptions-item v-for="col in list" :key="col.prop" :label="col.label">
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
import { BIconChevronLeft } from "bootstrap-icons-vue"
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
const expanded = ref(false)
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
