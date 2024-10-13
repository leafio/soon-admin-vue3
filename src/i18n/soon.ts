import { AllPaths, GetParams, GetValue, formatObjKey, flatTreeKey, loadLocale, loadSyncLocales } from "./common"
import { ref } from "vue"

export const createI18n = <Lang extends string, GlobalLocale extends Record<string, any> | undefined>(
  config: {
    lang?: Lang
    fallbacks?: Lang[]
  },
  globalLocales: Partial<Record<Lang, GlobalLocale | (() => Promise<{ default: GlobalLocale }>)>> = {},
) => {
  const _lang = ref<Lang>(config.lang ?? ("" as Lang))
  const _fallback_langs = ref<Lang[]>(config.fallbacks ?? [])
  const global_locales = ref<any>({})
  const global_locales_loading: Partial<Record<Lang, boolean | undefined>> = {}

  //初始化 同步 locales
  loadSyncLocales(globalLocales, global_locales.value)

  const tLocales = <Locale extends Record<string, any>>(locales: Partial<Record<Lang, Locale | (() => Promise<{ default: Locale }>)>> = {}) => {
    const cur_locales = ref<Partial<Record<Lang, any>>>({})
    const cur_locales_loading: Partial<Record<Lang, boolean | undefined>> = {}
    //初始化 同步 locales

    loadSyncLocales(locales, cur_locales.value)

    // watch(
    //     () => _lang.value,
    //     () => {
    //         if (!cur_locales.value[_lang.value])
    //             //加载异步locales
    //             loadLocale(
    //                 (res) => {
    //                     cur_locales.value[_lang.value] = flatTreeKey(res);
    //                 },
    //                 cur_locales_loading,
    //                 _lang.value,
    //                 locales
    //             );
    //     },
    //     { immediate: true }
    // );

    return ((id: string, ...obj: any) => {
      const locale_data = {}
      //合并所有已加载的locale
      ;[_lang.value, ..._fallback_langs.value].reverse().forEach((l) => {
        Object.assign(locale_data, global_locales.value[l], cur_locales.value[l])
      })

      if (!cur_locales.value[_lang.value] || !(id in locale_data)) {
        ;[_lang.value, ..._fallback_langs.value].some((_f_lang) => {
          if (!cur_locales.value[_f_lang]) {
            loadLocale(
              (res) => {
                cur_locales.value[_f_lang] = flatTreeKey(res)
              },
              cur_locales_loading,
              _f_lang,
              locales,
            )
            return true
          }
          if (!global_locales.value[_f_lang]) {
            loadLocale(
              (res) => {
                global_locales.value[_f_lang] = flatTreeKey(res)
              },
              global_locales_loading,
              _f_lang,
              globalLocales,
            )
            return true
          }
        })
      }

      return formatObjKey({ ...locale_data }, id, ...obj)
    }) as <ID extends AllPaths<Locale> | AllPaths<GlobalLocale>>(id: ID, ...arg: GetParams<GetValue<Locale, ID> | GetValue<GlobalLocale, ID>>) => string
  }
  return {
    tLocales,
    lang: _lang,
    fallbacks: _fallback_langs,
  }
}
