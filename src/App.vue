<template>
  <el-config-provider :locale="elementPlusLocale">
    <router-view />
  </el-config-provider>
</template>
<script setup lang="ts">
import { useDark, useTitle } from "@vueuse/core"
import { showMenuTitle } from "./router/utils"

import { createThemeColors, themeColors2cssText } from "./biz/app/theme"
import { useAppStore } from "./store/modules/app"

import { autoDayjsLocale } from "./i18n/third/dayjs"
import { elementPlusLocale } from "./i18n/third/element-plus"
import { replaceStyleTag } from "soon-utils"

autoDayjsLocale()

// dynamic set document title
const route = useRoute()
const title = useTitle()
watchEffect(() => {
  const appTitle = "Soon Admin"
  const metaTitle = showMenuTitle(route.meta.title)
  title.value = metaTitle ? `${metaTitle} | ${appTitle}` : appTitle
})

// dynamic theme
const isDark = useDark()
const appStore = useAppStore()

watch(
  [() => isDark.value, () => appStore.colors],
  ([_isDark, _colors]) => {
    const colors = createThemeColors(_colors, _isDark)
    const text = themeColors2cssText(colors)
    replaceStyleTag("theme-vars", text)
  },
  {
    deep: true,
    immediate: true,
  },
)
console.log("### app start ###")
</script>
