import pinia from "@/store/instance"
import { useUserStore } from "@/store/modules/user"

type AUTH_USER = "user.add" | "user.edit" | "user.del" | "user.export" | "user.list" | "user.detail"
type AUTH_DEPT = "dept.add" | "dept.edit" | "dept.del"
type AUTH_ROLE = "role.add" | "role.edit" | "role.del"
type AUTH_MENU = "menu.add" | "menu.edit" | "menu.del"

type AUTH_CODE = AUTH_USER | AUTH_DEPT | AUTH_ROLE | AUTH_MENU

function createAuthFun<T>(auth_code_arr: readonly T[] = []) {
  const auth = (code: T) => {
    const auth_codes = auth_code_arr
    return auth_codes.includes(code)
  }
  auth.any = (codes: T[]) => {
    const auth_codes = auth_code_arr
    return codes.some((code) => auth_codes.includes(code))
  }
  auth.all = (codes: T[]) => {
    const auth_codes = auth_code_arr
    return codes.every((code) => auth_codes.includes(code))
  }
  return auth
}
export function useAuth() {
  const userStore = useUserStore(pinia)
  const auth_codes = userStore.btnList ?? []
  return createAuthFun(auth_codes as AUTH_CODE[])
}
