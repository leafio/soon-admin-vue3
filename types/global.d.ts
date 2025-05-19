// 这段可以直接添加到你的任何 `.ts` 文件中，例如 `router.ts`
// 也可以添加到一个 `.d.ts` 文件中。确保这个文件包含在
// 项目的 `tsconfig.json` 中的 "file" 字段内。
import type { Directive } from "vue"
import { Component } from "vue"

import "vue-router"

// 为了确保这个文件被当作一个模块，添加至少一个 `export` 声明
export {}

declare module "vue-router" {
  interface RouteMeta {
    requiresAuth?: boolean
    title?: string | (() => string)
    link?: string
    isHide?: boolean
    isKeepAlive?: boolean
    isAffix?: boolean
    isIframe?: boolean
    icon?: string | object
    layout?: string
  }
}

// import type { AUTH_CODE } from "@/biz/app/auth"
// declare module "vue" {
//   export interface ComponentCustomProperties {
//     vAuth: Directive<HTMLElement, AUTH_CODE>
//   }
// }

// declare module "@vue/runtime-dom" {
//   interface HTMLAttributes {
//     "v-auth"?: never // 禁止直接使用 v-auth（无参数）
//   }
// }

declare global {}
