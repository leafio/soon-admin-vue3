import { tLocales } from "@/i18n"
import en_login from "@/i18n/locales/en/login"
import ko_login from "@/i18n/locales/ko/login"
import zh_login from "@/i18n/locales/zh/login"

import type { RouteRecordRaw } from "vue-router"
const t = tLocales({ zh: zh_login, en: en_login, ko: ko_login })

const PAGE_404_NAME = "notFound"
const PAGE_LOGIN_URL = "/login"
const staticRoutes: RouteRecordRaw[] = [
  {
    path: PAGE_LOGIN_URL,
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
        name: PAGE_404_NAME,
        component: () => import("@/views/error/404.vue"),
        meta: {
          title: () => "Not Found",
          isHide: true,
        },
      },
    ],
  },
]

export { staticRoutes, PAGE_404_NAME, PAGE_LOGIN_URL }
