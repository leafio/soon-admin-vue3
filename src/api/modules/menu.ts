import type { PagedParams } from "../types"
import { soon } from "../request"
import type { RouteMeta } from "vue-router"

export type Menu = {
  id: number
  name: string
  desc: string
  sort: number
  parentId: number
  menuType: string
  auth: string
  path: string
  redirect: string
  children?: Menu[]
  createTime: string
  updateTime: string
  meta: RouteMeta & { title?: string; icon?: string }
}
export const tree_menu = soon.GET("/menu/tree").Query<PagedParams & { hasBtn?: boolean }>().Send<{ list: Menu[] }>()
export const add_menu = soon.POST("/menu/create").Body<Menu>().Send()
export const update_menu = soon.PUT("/menu/update").Body<Menu>().Send()
export const del_menu = soon.DELETE("/menu/delete").Body<{ id: number }>().Send()
