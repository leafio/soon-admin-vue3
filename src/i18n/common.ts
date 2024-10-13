/* eslint-disable @typescript-eslint/no-empty-object-type */
export const formatString = (str: string, obj: Record<string, any>) => {
  if (str.indexOf("{") === -1) {
    return str
  }
  let result = str
  const pattern = /\{(.*?)\}/g
  const matches = str.match(pattern)
  if (matches)
    matches.forEach((word) => {
      if (word.length > 2) {
        const key = word.slice(1, word.length - 1)
        result = result.replace(new RegExp(word, "gm"), obj[key] ?? "")
      }
    })
  return result
}

export type AllPaths<T> = T extends {} // 如果 T 是一个对象类型
  ? {
      [K in keyof T]-?: K extends string // 对于 T 中的每个属性 K，如果 K 是字符串类型
        ? T[K] extends string | ((...args: any) => any)
          ? `${K}` // 将 K 转换成字符串字面量类型
          : `${K}.${AllPaths<T[K]> extends string ? AllPaths<T[K]> : never}` // 递归地获取 T[K] 的所有路径，并将它们拼接在 K 后面
        : never // 否则返回 never 类型（表示不存在）
    }[keyof T] // 最后将所有属性的结果合并为联合类型
  : never // 如果 T 不是一

// .链式key值 如{a:{b:{c:3}}} 转换成 {a.b.c:3}
export const flatTreeKey = (obj: Record<string, any>, curKey = "", result: Record<string, any> = {}) => {
  for (const key of Object.keys(obj)) {
    // console.log(e)(key, curKey);
    const new_key = `${curKey ? curKey + "." : ""}${key}`
    if (typeof obj[key] !== "object") {
      result[new_key] = obj[key]
    } else {
      flatTreeKey(obj[key], new_key, result)
    }
  }
  return result
}

export const formatObjKey = (messages: any, id: string, ...obj: any) => {
  if (!messages) return ""
  const str = messages[id] || id
  if (!obj.length) return str
  if (typeof str === "function") return str(...obj)
  return formatString(str, obj[0])
}

export const loadLocale = (callback: (locale: any) => void, langLoading: Record<string, any>, lang?: string, localesRaw?: Record<string, any>) => {
  if (localesRaw && lang && !langLoading[lang]) {
    const data = localesRaw[lang]
    if (typeof data === "function") {
      langLoading[lang] = true
      data()
        .then((res: { default: any }) => {
          callback(res.default ?? {})
        })
        .finally(() => {
          delete langLoading[lang]
        })
    } else {
      callback(data ?? {})
    }
  }
}

export const loadSyncLocales = (rawLocales: any, targetLocales: any = {}) => {
  for (const l in rawLocales) {
    if (rawLocales[l] && typeof rawLocales[l] === "object") {
      targetLocales[l] = flatTreeKey(rawLocales[l])
    }
  }
  return targetLocales
}

export type GetParamsOfStr<Str> = Str extends `${string}{${infer Key}}${infer Right}` ? `${Key}` | GetParamsOfStr<`${Right}`> : never
export type OptionParams<Params> = Params extends never ? [obj?: any] : Partial<Params> extends Params ? [obj?: Params] : [obj: Params]
export type GetParamsOfFun<Fun extends (...args: any) => any> = Parameters<Fun>
export type GetParams<T> = T extends (...args: any) => any
  ? GetParamsOfFun<T>
  : OptionParams<{
      [key in GetParamsOfStr<T>]: string | number
    }>

export type GetValue<data, path> = data extends string
  ? never
  : data extends {}
    ? {
        [K in keyof data]-?: K extends string ? (path extends K ? data[K] : path extends `${K}.${infer Right}` ? GetValue<data[K], Right> : never) : never
      }[keyof data]
    : never
