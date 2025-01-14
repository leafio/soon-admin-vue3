<template>
  <div class="tab" :class="{ active }">
    <span>{{ label }}</span>
    <BIconXLg v-if="closable" class="ml-1 text-gray-700 hover:text-red-600 w-3 h-3" @click="handleCloseClick" />
  </div>
</template>
<script setup lang="ts">
import { BIconXLg } from "bootstrap-icons-vue"
defineProps<{
  label: string
  active?: boolean
  closable?: boolean
}>()
const emit = defineEmits(["close"])
const handleCloseClick = (e: MouseEvent) => {
  e.stopPropagation()
  emit("close")
}
</script>

<style scoped>
.tab {
  height: 2em;
  display: flex;
  align-items: center;
  padding: 0 8px;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  white-space: nowrap;
}

/* .tab::after {
  content: "";
  height: 70%;
  width: 1px;
  background-color: rgb(185, 185, 185);
  margin-left: 8px;
} */
.tab.active,
.tab:hover {
  @apply shadow text-primary-600;
}

.tab.active {
  @apply border-primary-600;
}

/* .tab.active,
.tab:has(+ .tab.active) {
  @apply shadow;
  &::after {
    background-color: transparent;
  }
} */
</style>
