import zhCn from "element-plus/es/locale/lang/zh-cn"
import en from "element-plus/es/locale/lang/en"
import ko from "element-plus/es/locale/lang/ko"
import type { Lang } from "../type"
import { lang } from ".."

const elementPlusLocales = {
  zh: zhCn,
  en: en,
  ko,
} satisfies Record<Lang, any>

export const elementPlusLocale = computed(() => elementPlusLocales[lang.value])
