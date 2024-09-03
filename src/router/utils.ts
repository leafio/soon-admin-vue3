import { Menu } from "@/api"
import { tMessages } from "@/i18n"
import { en_menu } from "@/i18n/en/menu"
import { zh_menu } from "@/i18n/zh/menu"
import router from "@/router/index"

import { RouteRecordRaw } from "vue-router"

// 引入 views 文件夹下所有 vue 文件
const modules = import.meta.glob("@/views/**/*.vue")
const layouts = import.meta.glob("@/layout/**/*.vue")

const getComponent = (component: any) => {
  if (component && typeof component == "string") {
    const suffix = component.endsWith(".vue") ? "" : ".vue"
    const componentPath = component
    return modules["/src/views" + componentPath + suffix] ?? layouts["/src/layout" + componentPath + suffix]
  }
  return component
}

function parseRouteComponent(routes: { component?: string | any; children?: any[] }[]) {
  return routes.map((item) => {
    const result = Object.assign({}, item)
    if (item.component) Object.assign(result, { component: getComponent(item.component) })

    if (item.children) Object.assign(result, { children: parseRouteComponent(item.children) })

    return result as RouteRecordRaw
  })
}
const t = tMessages({ "zh-cn": zh_menu, en: en_menu })

export const parseMenuTitle = (menus: Menu[]): Menu[] => {
  return menus.map((m) => {
    return {
      ...m,
      meta: {
        ...m.meta,
        title: () => t((m.meta.title ?? "") as any),
      },
      children: m.children ? parseMenuTitle(m.children) : [],
    }
  }) as unknown as Menu[]
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

/**
 * @description 初始化动态路由
 */
export async function initRoute(menus: Menu[]) {
  const parsed = parseRouteComponent(menus)
  parsed.forEach((item) => {
    if (item.meta?.layout) {
      router.addRoute(item.meta.layout, item)
    } else {
      router.addRoute(item)
    }
  })

  return parsed
}
