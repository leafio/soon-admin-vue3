import { tLocales } from "@/i18n"
import en_login from "@/i18n/locales/en/login"
import ko_login from "@/i18n/locales/ko/login"
import zh_login from "@/i18n/locales/zh/login"

import type { RouteRecordRaw } from "vue-router"

const t = tLocales({ zh: zh_login, en: en_login, ko: ko_login })
const staticRoutes: RouteRecordRaw[] = [
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/login/index.vue"),
    meta: {
      title: () => t("login"),
    },
  },
  {
    path: "/layout",
    name: "layout",
    redirect: "/",
    component: () => import("@/layout/index.vue"),
    children: [
      {
        path: "/:path(.*)*",
        name: "notFound",
        component: () => import("@/views/error/404.vue"),
        meta: {
          title: () => "Not Found",
          isHide: true,
        },
      },
    ],
  },
]

export default staticRoutes
