import { createI18nSafe } from "soon-i18n-vue"
import en_global from "./locales/en/global"
import zh_global from "./locales/zh/global"
import ko_global from "./locales/ko/global"
import type { Lang } from "./type"
import { soon_local } from "@/biz/app/local"

const global_locales = { zh: zh_global, en: en_global, ko: ko_global }

export const { tLocales, lang } = createI18nSafe(
  {
    lang: soon_local.getItem("lang") ?? "zh",
    fallbacks: ["en"],
  },
  global_locales,
)

export type { Lang }
