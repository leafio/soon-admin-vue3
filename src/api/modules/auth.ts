import { soon } from "../request"
import type { Menu } from "./menu"
import type { User } from "./user"
export const login = soon.API("/login").POST<{ username: string; password: string }, { token: string; refreshToken: string }>()
export const logout = soon.API("/logout").POST()
export const own_userinfo = soon.API("auth/profile").GET<undefined, User>()
export const own_menus = soon.API("/auth/route").GET<undefined, Menu[]>()
export const own_auth_codes = soon.API("/auth/code").GET<undefined, string[]>()
export const refresh_token = soon.API("/auth/refresh").POST<{ token: string }, { token: string; refreshToken: string }>()
export const change_pwd = soon.API("/auth/change_pwd").POST<{ password: string; new_password: string }>()
export const getCaptcha = soon.API("/captcha").GET<undefined, { id: number; img: string }>()
