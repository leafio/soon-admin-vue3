import { createGrigVue } from "grig/vue"
import { en_global } from "./en/global"
import { zh_global } from "./zh/global"

const global_messages = { zh: zh_global, en: en_global }
export const { tMessages, lang } = createGrigVue({ lang: localStorage.getItem("lang") ?? "zh", fallbackLang: "en" }, global_messages)
