import { FormInstance } from "element-plus"
import { UnwrapRef } from "vue"

type DialogHookProps<T> = {
  formRef: Ref<FormInstance | undefined>
  initFormData?: Partial<T>
}

export function useDialog<T>({ formRef, initFormData }: DialogHookProps<T>) {
  const formData = ref(Object.assign({}, initFormData) as T)
  const _type = ref<"add" | "edit" | "detail">("add")
  const visible = ref(false)
  // 关闭弹窗
  const close = () => {
    visible.value = false
    formRef.value?.resetFields()
  }

  // 打开弹窗
  const open = (type: "add" | "edit" | "detail" = "add", data?: Partial<T>, link = false) => {
    _type.value = type
    if (type == "add") {
      formData.value = structuredClone(Object.assign({}, initFormData, data)) as UnwrapRef<T>
    } else {
      const _data = (data ?? {}) as UnwrapRef<T>
      if (link) {
        formData.value = _data
      } else {
        formData.value = JSON.parse(JSON.stringify(_data))
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
