import pinia from "@/store"
import { useUserStore } from "@/store/modules/user"

export function useAuth() {
  const auth = (code: string) => {
    const userStore = useUserStore(pinia)
    const auth_codes = userStore.btnList ?? []
    return auth_codes.includes(code)
  }
  auth.any = (codes: string[]) => {
    const userStore = useUserStore(pinia)
    const auth_codes = userStore.btnList ?? []
    return codes.some((code) => auth_codes.includes(code))
  }

  auth.all = (codes: string[]) => {
    const userStore = useUserStore(pinia)
    const auth_codes = userStore.btnList ?? []
    return codes.every((code) => auth_codes.includes(code))
  }
  return auth
}
