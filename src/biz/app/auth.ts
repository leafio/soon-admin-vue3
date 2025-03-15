import pinia from "@/store/instance"
import { useUserStore } from "@/store/modules/user"

type AUTH_USER = "user.add" | "user.edit" | "user.del" | "user.export" | "user.list" | "user.detail"
type AUTH_DEPT = "dept.add" | "dept.edit" | "dept.del"
type AUTH_ROLE = "role.add" | "role.edit" | "role.del"
type AUTH_MENU = "menu.add" | "menu.edit" | "menu.del"

type AUTH_CODE = AUTH_USER | AUTH_DEPT | AUTH_ROLE | AUTH_MENU

function createAuthFun<T>(auth_codes: Ref<T[]>) {
  const auth = (code: T) => {
    return computed(() => auth_codes.value.includes(code))
  }
  auth.any = (codes: T[]) => {
    return computed(() => codes.some((code) => auth_codes.value.includes(code)))
  }
  auth.all = (codes: T[]) => {
    return computed(() => codes.every((code) => auth_codes.value.includes(code)))
  }
  return auth
}
function useAuth() {
  const userStore = useUserStore(pinia)
  const auth_codes = computed(() => (userStore.btnList as AUTH_CODE[]) ?? [])
  return createAuthFun(auth_codes)
}
export const auth = useAuth()
