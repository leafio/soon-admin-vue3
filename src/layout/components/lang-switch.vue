<template>
  <el-dropdown class="cursor-pointer" :show-timeout="70" :hide-timeout="50" trigger="click" @command="handleLangChange">
    <div>
      <BIconTranslate :class="iconClass" />
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="zh-cn" :disabled="lang === 'zh-cn'">简体中文</el-dropdown-item>
        <el-dropdown-item command="en" :disabled="lang === 'en'">English</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
<script setup lang="ts">
import { lang } from "@/i18n"
import { BIconTranslate } from "bootstrap-icons-vue"
const props = defineProps<{ iconClass?: string }>()
const { iconClass } = toRefs(props)
const handleLangChange = (e: string) => {
  lang.value = e
  localStorage.setItem("lang", lang.value)
}
watch(
  lang,
  () => {
    document.documentElement.lang = lang.value
  },
  { immediate: true },
)
</script>
