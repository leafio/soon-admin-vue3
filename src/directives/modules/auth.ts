// utils/directives/auth.ts
import { auth } from "@/biz/app/auth"
import type { App, Directive, DirectiveBinding } from "vue"

const checkAuth = (el: HTMLElement, binding: DirectiveBinding) => {
  const { value } = binding
  // 未匹配权限时移除元素，但无法再次添加
  watchEffect(() => {
    const getAuth = binding.modifiers.any ? auth.any : auth
    if (!getAuth(value)) {
      el.parentNode?.removeChild(el)
    }
  })
}

const authDirective: Directive = {
  mounted: checkAuth,
  updated: checkAuth,
}
export default authDirective
