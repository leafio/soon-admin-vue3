import type { UnwrapRef } from "vue"

export function useDialog<T>(initFormData?: Partial<T>) {
  const formData = ref(Object.assign({}, initFormData) as T)
  const _type = ref<"add" | "edit" | "detail">("add")
  const visible = ref(false)
  // 关闭弹窗
  const close = () => {
    visible.value = false
  }
  const loading = ref(false)
  // 打开弹窗
  const open = (type: "add" | "edit" | "detail" = "add", data?: Partial<T> | (() => Promise<T>), link = false) => {
    _type.value = type
    if (type == "add") {
      formData.value = structuredClone(Object.assign({}, initFormData, data)) as UnwrapRef<T>
    } else {
      formData.value = structuredClone(Object.assign({}, initFormData)) as UnwrapRef<T>
      if (typeof data === "function") {
        loading.value = true
        data().then((res) => {
          formData.value = res
          loading.value = false
        })
      } else {
        const _data = (data ?? {}) as UnwrapRef<T>
        if (link) {
          formData.value = _data
        } else {
          formData.value = JSON.parse(JSON.stringify(_data))
        }
      }
    }
    visible.value = true
  }
  return {
    visible,
    open,
    close,
    type: _type,
    formData,
  }
}
