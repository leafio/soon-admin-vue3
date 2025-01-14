import { tLocales } from "@/i18n"
import menu_locales from "@/i18n/collect/menu_locales"

const t = tLocales(menu_locales)

import type { RouteRecordRaw } from "vue-router"

const iframe = () => import("@/components/iframe.vue")

// 引入 views 文件夹下所有 vue 文件
const modules = import.meta.glob("@/views/**/*.vue")

const getComponent = (path: string) => {
  const path_list = [".vue", "/index.vue"].map((p) => path + p)
  let result
  path_list.some((p) => {
    const _path = "/src/views" + p
    const component = modules[_path]
    if (component) {
      result = component
      return true
    }
  })
  return result
}

export function parseRoutesComponent(routes: { component?: string | any; path: string; children?: any[]; meta: any }[]) {
  return routes.map((item) => {
    const result = Object.assign({}, item)
    if (item.meta?.isIframe) {
      Object.assign(result, { component: iframe })
    } else if (item.component === null || typeof item.component !== "object") Object.assign(result, { component: getComponent(item.path) })
    if (item.children) Object.assign(result, { children: parseRoutesComponent(item.children) })
    return result as RouteRecordRaw
  })
}

function runStrFun(val: string | (() => string) = "") {
  if (typeof val === "function") return val()
  return val
}

export const showMenuTitle = (title?: string | (() => string)) => {
  return runStrFun(typeof title === "string" ? () => t((title ?? "") as any) : title)
}

/**动态解析 redirect */
export function parseRedirectNext(routes: { path: string; redirect?: string; children?: any }[]): any[] {
  return routes.map((item) => {
    if (item.redirect === "toNext" && item.children?.length) {
      const children = parseRedirectNext(item.children)
      return {
        ...item,
        redirect: children[0].redirect || children[0].path,
      }
    }
    return item
  })
}
