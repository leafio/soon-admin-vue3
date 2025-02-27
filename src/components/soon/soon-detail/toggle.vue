<template>
  <div @click="expanded = !expanded">
    <slot>
      <BIconChevronLeft
        class="transition-transform bg-primary-100 dark:bg-primary-700 dark:text-neutral-200 rounded-full w-6 h-6 p-1 text-primary-700 stroke-2 cursor-pointer"
        :class="{ '-rotate-90': expanded }"
      />
    </slot>
  </div>
</template>
<script setup lang="ts">
import { BIconChevronLeft } from "bootstrap-icons-vue"
const expanded = inject<Ref<boolean>>("expanded")
</script>
