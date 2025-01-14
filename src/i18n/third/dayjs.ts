import { locale } from "dayjs"
import "dayjs/locale/ko"
import "dayjs/locale/en"
import "dayjs/locale/zh-cn"

import type { Lang } from "../type"
import { lang } from ".."

function setDayjsLocale(lang: Lang) {
  const localMap = {
    zh: "zh-cn",
    en: "en",
    ko: "ko",
  } satisfies Record<Lang, string>

  locale(localMap[lang])
}
export function autoDayjsLocale() {
  watch(
    lang,
    () => {
      setDayjsLocale(lang.value)
    },
    { immediate: true },
  )
}
