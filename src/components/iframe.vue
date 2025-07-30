<template>
  <iframe :src="link" class="h-full flex-1" @load="loading = false"> </iframe>
</template>
<script setup lang="ts">
import { ElLoading } from "element-plus"

defineProps<{
  link: string
}>()
const loading = ref(true)
const elLoad = ElLoading.service({
  lock: true,
})
watchEffect(() => {
  if (!loading.value) elLoad.close()
})
</script>
