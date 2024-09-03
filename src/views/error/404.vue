<template>
  <div class="text-red-600 text-lg">404</div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router"

// 定义变量内容
const router = useRouter()

// 返回首页
const onGoHome = () => {
  router.push("/")
}
</script>

<style scoped lang="scss"></style>
