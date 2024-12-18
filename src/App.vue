<template>
  <el-config-provider :locale="langData[lang]">
    <router-view />
  </el-config-provider>
</template>
<script setup lang="ts">
import { lang } from "@/i18n"
import zhCn from "element-plus/es/locale/lang/zh-cn"
import en from "element-plus/es/locale/lang/en"
import ko from "element-plus/es/locale/lang/ko"
import { useTitle } from "@vueuse/core"
import { useAppStore } from "./store/modules/app"
import { runStrFun } from "./utils"
import { useBreakpoints, breakpointsTailwind } from "@vueuse/core"
const langData = {
  zh: zhCn,
  en: en,
  ko,
}

const route = useRoute()
const title = useTitle()
const appStore = useAppStore()
// dynamic set document title
watchEffect(() => {
  const appTitle = "Soon Admin"
  const metaTitle = runStrFun(route.meta.title)
  title.value = metaTitle ? `${metaTitle} | ${appTitle}` : appTitle
})

const breakpoints = useBreakpoints(breakpointsTailwind)
const smallerThanMd = breakpoints.smaller("md")
watchEffect(() => {
  appStore.responsive = smallerThanMd.value ? "mobile" : "pc"
})
console.log("### app start ###")
</script>
