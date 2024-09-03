import { soon } from "../request"
import { Menu } from "./menu"
import { User } from "./user"
export const login = soon.API("/login").POST<{ username: string; password: string }, { token: string; userInfo: User; btnList: string[]; menus: any[] }>()
export const logout = soon.API("/logout").POST()
export const own_userinfo = soon.API("/auth/profile").GET<undefined, User>()
export const own_menus = soon.API("/auth/route").GET<undefined, Menu[]>()
export const own_auth_codes = soon.API("/auth/code").GET<undefined, string[]>()
