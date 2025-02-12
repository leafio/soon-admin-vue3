import { downloadBlob, getHeaderFilename } from "soon-utils"
import type { PagedParams, PagedRes } from "../types"
import type { Dept } from "./dept"
import type { Role } from "./role"
import { soon } from "../request"
import type { Simplify } from "type-fest"

export type User = {
  id: number
  username: string
  password: string | null
  email: string | null
  phone: string | null
  name: string | null
  nickname: string | null
  avatar: string | null
  roleId: number | undefined
  deptId: number | undefined
  status: number
  gender: number
  desc: string | null
}
export type UserInfo = User & {
  id: number
  createTime: string
  updateTime: string | null
  dept?: Pick<Dept, "id" | "name">
  role?: Pick<Role, "id" | "name">
}

type ListQueryUser = Simplify<PagedParams & { keyword?: string; timeRange?: [string, string] }>
export const list_user = soon.API("/user").GET<ListQueryUser, PagedRes<UserInfo>>()
export const add_user = soon.API("/user").POST<User>()
export const update_user = soon.API("/user/:id").PUT<User>()
export const del_user = soon.API("/user/:id").DELETE()
export const detail_user = soon.API("/user/:id").GET<undefined, UserInfo>()

export const download_user_table = async (query: ListQueryUser) => {
  return soon.get<Response>("/user/export", { query }).then(async (res) => {
    const filename = getHeaderFilename(res.headers) ?? "user.xlsx"
    const body = await res.blob()
    downloadBlob(body, filename)
  })
}

export const getCaptcha = soon.API("/captcha").GET<undefined, { id: number; img: string }>()
