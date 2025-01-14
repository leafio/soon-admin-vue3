//目前仅测试批量加载

const ALL_LOCALES = ["zh", "en", "ko"] as const

export function loadLocales<Locale>(path: (lang: Lang) => string, langs: readonly Lang[] = ALL_LOCALES) {
  const result = {} as any
  langs.forEach((lang) => {
    result[lang] = () => import(path(lang))
  })
  return result as Record<Lang, () => Promise<{ default: Locale }>>
}

import type { Lang } from "./type"
import type zh_system_user from "./locales/zh/system/user"

const locales = loadLocales<typeof zh_system_user>((lang) => `/src/i18n/${lang}/system/user`)
