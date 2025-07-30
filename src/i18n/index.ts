import { createI18nSafe } from "soon-i18n-vue"
import en_global from "./locales/en/global"
import zh_global from "./locales/zh/global"
import ko_global from "./locales/ko/global"
export type { Lang } from "./type"
import { soon_local } from "@/biz/app/storage"

const global_locales = { zh: zh_global, en: en_global, ko: ko_global }

export const { tLocales, lang } = createI18nSafe(
  {
    lang: soon_local.lang.get(),
    fallbacks: ["en"],
  },
  global_locales,
)
