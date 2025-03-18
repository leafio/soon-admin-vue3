import pinia from "@/store/instance"
import { useUserStore } from "@/store/modules/user"

type AUTH_USER = "user.add" | "user.edit" | "user.del" | "user.export" | "user.list" | "user.detail"
type AUTH_DEPT = "dept.add" | "dept.edit" | "dept.del"
type AUTH_ROLE = "role.add" | "role.edit" | "role.del"
type AUTH_MENU = "menu.add" | "menu.edit" | "menu.del"

export type AUTH_CODE = AUTH_USER | AUTH_DEPT | AUTH_ROLE | AUTH_MENU

function createAuthFun<T>(auth_codes: Ref<T[]>) {
  const auth = (code: T | T[]) => {
    const state = reactive({ pass: false })
    watchEffect(() => {
      const codes = Array.isArray(code) ? code : [code]
      state.pass = codes.every((c) => auth_codes.value.includes(c))
    })
    return state.pass
  }
  auth.any = (codes: T[]) => {
    const state = reactive({ pass: false })
    watchEffect(() => {
      state.pass = codes.some((code) => auth_codes.value.includes(code))
    })
    return state.pass
  }
  return auth
}
function useAuth() {
  const userStore = useUserStore(pinia)
  const auth_codes = computed(() => (userStore.btnList as AUTH_CODE[]) ?? [])
  return createAuthFun(auth_codes)
}
export const auth = useAuth()
