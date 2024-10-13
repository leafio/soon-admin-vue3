<template>
  <el-popover ref="popoverRef" placement="bottom-start" :popper-style="{ padding: 0 }" width="200" trigger="click" :virtual-ref="triggerRef" virtual-triggering>
    <div class="flex justify-between pt-[3px] px-[11px] border-b-[1px] border-solid border-[#dcdfe6] dark:border-[#303030]">
      <el-checkbox v-model="checkAll" class="!-mr-1" :label="t('cols')" :indeterminate="isIndeterminate" />
      <el-button type="primary" link @click="() => emit('reset')"> {{ t("reset") }} </el-button>
    </div>

    <div class="pt-[6px] pl-[11px]">
      <el-scrollbar max-height="36vh">
        <div ref="listContainerRef" class="flex flex-col">
          <div v-for="item in cachedCols" :key="item.prop" class="col-item flex items-center">
            <!-- <div
            v-for="(item, index) in model"
            :key="item.prop"
            class="col-item flex items-center cursor-pointer"
            :draggable="true"
            @dragover.prevent="() => {}"
            @dragenter="onDragEnter(index)"
            @dragleave="onDragLeave(index)"
            @drag="dragIndex = index"
          ></div> -->
            <DCaret class="drag-btn mr-2 w-4 h-4 text-gray-400 cursor-move" />
            <el-checkbox v-model="model.find((col) => col.prop === item.prop)!.checked">
              <span class="inline-block w-[120px] truncate">
                {{ item.label }}
              </span>
            </el-checkbox>
          </div>
        </div>
      </el-scrollbar>
    </div>
  </el-popover>
</template>

<script setup lang="ts">
import { DCaret } from "@element-plus/icons-vue"
import { Col } from "./type"
import { useThrottleFn } from "@vueuse/core"
import Sortable from "sortablejs"
import { tLocales } from "@/i18n"
const popoverRef = ref()

const props = defineProps<{
  triggerRef: Ref
}>()

const emit = defineEmits(["reset"])
const model = defineModel<Col[]>({ default: [] })
const t = tLocales()

const cachedCols = computed(() => {
  return model.value.map(({ prop, label }) => ({ prop, label }))
})
const refSort = ref()
const listContainerRef = ref()
const isMounted = ref(false)
onMounted(() => (isMounted.value = true))
watch(
  [() => cachedCols.value, () => isMounted.value],
  () => {
    if (refSort.value) refSort.value.destroy()
    if (listContainerRef.value)
      refSort.value = Sortable.create(listContainerRef.value, {
        draggable: ".col-item",
        animation: 300,
        onEnd({ newIndex = 0, oldIndex = 0 }) {
          const list = [...model.value]
          const item = list.splice(oldIndex, 1)[0]
          list.splice(newIndex, 0, item)
          model.value = list
        },
      })
  },
  { deep: true, immediate: true },
)

const isIndeterminate = computed(() => {
  const checkedLength = model.value.filter((col) => col.checked).length
  return checkedLength > 0 && checkedLength !== model.value.length
})

const checkAll = computed({
  get() {
    return model.value.filter((col) => col.checked).length === model.value.length
  },
  set(val) {
    model.value.forEach((col) => (col.checked = val))
  },
})

// const dragIndex = ref(0)
// const onDragLeave = (targetIndex: number) => {}

// const onDragEnter = useThrottleFn((targetIndex: number) => {
//   console.log("drag-enter", dragIndex.value, targetIndex)
//   if (dragIndex.value === targetIndex) return
//   const list = [...model.value]
//   const item = list.splice(dragIndex.value, 1)[0]
//   list.splice(targetIndex, 0, item)
//   model.value = list
//   dragIndex.value = targetIndex
// }, 250)

defineExpose({
  popoverRef,
})
</script>
