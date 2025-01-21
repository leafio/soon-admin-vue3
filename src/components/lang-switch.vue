<template>
  <el-dropdown :show-timeout="70" :hide-timeout="50" trigger="click" @command="handleLangChange">
    <BIconTranslate :class="' outline-none ' + iconClass" />

    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="zh" :disabled="lang === 'zh'">中文</el-dropdown-item>
        <el-dropdown-item command="en" :disabled="lang === 'en'">English</el-dropdown-item>
        <el-dropdown-item command="ko" :disabled="lang === 'ko'">한국어</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
<script setup lang="ts">
import type { Lang } from "@/i18n"
import { lang } from "@/i18n"
import { BIconTranslate } from "bootstrap-icons-vue"
import { soon_local } from "@/biz/app/local"
const props = defineProps<{ iconClass?: string }>()
const { iconClass } = toRefs(props)
const handleLangChange = (e: Lang) => {
  lang.value = e
  soon_local.setItem("lang", lang.value)
}
watch(
  lang,
  () => {
    document.documentElement.lang = lang.value
  },
  { immediate: true },
)
</script>
