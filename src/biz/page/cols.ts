import type { Paths } from "type-fest"
import type { JSX } from "vue/jsx-runtime"

export function useCols<T extends { prop: string }>(colsFun: () => T[]) {
  const cols = computed(colsFun)

  const _cols = ref<(T & { checked: boolean })[]>([])
  const key = ref(0)
  watch(
    [() => cols, () => key.value],
    () => {
      _cols.value = cols.value.map((col) => ({ ...col, checked: _cols.value.find((item) => item.prop === col.prop)?.checked ?? true })) as any
    },
    {
      immediate: true,
      deep: true,
    },
  )
  const reset = () => {
    _cols.value = []
    key.value++
  }
  const checkedCols = computed(() => _cols.value.filter((col) => col.checked))
  return {
    cols: _cols,
    checkedCols,
    reset,
  }
}

export type ElTableCol<T, Keys = ""> = {
  prop: Paths<T> | Keys
  label: string
  width?: string | number
  minWidth?: string | number
  sortable?: boolean
  fixed?: string
  render?: (args: { item: T }) => JSX.Element | string | undefined
}
