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
