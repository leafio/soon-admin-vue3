import { tLocales } from "@/i18n"
import menu_locales from "@/i18n/collect/menu_locales"

import { Document } from "@element-plus/icons-vue"
import type { RouteRecordRaw } from "vue-router"

const t = tLocales(menu_locales)

export const bizRoutes: RouteRecordRaw[] = [
  {
    path: "/home",
    component: () => import("@/views/home/index.vue"),
    meta: {
      title: () => "首页",
      layout: "layout",
      isAffix: true,
    },
  },

  {
    path: "/feature",
    meta: {
      title: () => "功能",
      layout: "layout",
    },
    children: [
      {
        path: "/iframe",
        component: () => import("@/components/iframe.vue"),

        meta: {
          title: () => "iframe",
          link: "https://www.baidu.com",
          isIframe: true,
          isKeepAlive: true,
        },
      },
      {
        path: "/link",
        component: () => import("@/components/iframe.vue"),

        meta: {
          title: () => "link",
          link: "https://www.baidu.com",
          isKeepAlive: true,
        },
      },
    ],
  },
  {
    path: "/system",
    redirect: "toNext",
    meta: {
      title: () => t("system"),
      isKeepAlive: true,
      icon: Document,
      layout: "layout",
    },
    children: [
      {
        path: "/system/user",
        component: () => import("@/views/system/user/index.vue"),
        meta: {
          title: () => t("user"),
          isKeepAlive: true,
        },
      },
      {
        path: "/system/role",
        component: () => import("@/views/system/role/index.vue"),
        meta: {
          title: () => t("role"),
          isKeepAlive: true,
        },
      },
      {
        path: "/system/dept",
        component: () => import("@/views/system/dept/index.vue"),
        meta: {
          title: () => t("dept"),
          isKeepAlive: true,
        },
      },
      {
        path: "/system/menu",
        component: () => import("@/views/system/menu/index.vue"),
        meta: {
          title: () => t("menu"),
          isKeepAlive: true,
        },
      },
    ],
  },
]

export default bizRoutes
