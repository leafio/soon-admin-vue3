import { createI18nSafe } from "soon-i18n-vue"
import en_global from "./en/global"
import zh_global from "./zh/global"
import ko_global from "./ko/global"

const global_messages = { zh: zh_global, en: en_global, ko: ko_global }
export type Lang = "zh" | "en" | "ko"
export const { tLocales, lang } = createI18nSafe(
  {
    lang: (localStorage.getItem("lang") ?? "zh") as Lang,
    fallbacks: ["en"],
  },
  global_messages,
)
