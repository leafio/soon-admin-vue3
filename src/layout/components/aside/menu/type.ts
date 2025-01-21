import type { RouteMeta } from "vue-router"

export type SoonMenu = {
  id: number
  name: string
  desc: string
  sort: number
  parentId: number
  menuType: string
  auth: string
  path: string
  redirect: string
  children?: SoonMenu[]
  createTime: string
  updateTime: string
  meta: RouteMeta & { title?: string; icon?: string }
}
