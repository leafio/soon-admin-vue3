import { createI18n } from "soon-i18n-vue"
import en_global from "./en/global"
import zh_global from "./zh/global"

const global_messages = { zh: zh_global, en: en_global }
export type Lang = "zh" | "en"
type GlobalLocale = typeof zh_global | typeof en_global
export const { tLocales, lang } = createI18n<Lang, GlobalLocale>(
  {
    lang: (localStorage.getItem("lang") ?? "zh") as Lang,
    fallbacks: ["en"],
  },
  global_messages,
)
