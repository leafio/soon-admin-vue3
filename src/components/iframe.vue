<template>
  <iframe :src="link" class="h-full flex-1"> </iframe>
</template>
<script setup lang="ts">
defineProps<{
  link: string
}>()
</script>
