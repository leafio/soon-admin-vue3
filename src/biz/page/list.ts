import { ref, watch } from "vue"
import { watchDebounced } from "@vueuse/core"
import type { PagedParams, PagedRes } from "@/api/types"

//分页查询
export function usePageList<R, T extends (args: PagedParams) => Promise<PagedRes<R>>, MapFun extends (item: Awaited<ReturnType<T>>["list"][0]) => R>({
  searchApi,
  mapFun,
  initQuery,
  autoSearchDelay,
}: {
  searchApi: T
  initQuery?: Parameters<T>[0]
  mapFun?: MapFun
  autoSearchDelay?: number
}) {
  type Item = Awaited<ReturnType<T>>["list"][0]
  const list = ref<Item[]>([])
  const total = ref(0)
  const loading = ref(false)
  const initPageInfo: PagedParams = { pageIndex: 1, pageSize: 10 }

  const query = reactive<Parameters<T>[0]>({ ...initPageInfo, ...initQuery })

  //网络请求response原数据
  const res = ref()

  const refresh = () => {
    loading.value = true

    const timeout = new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve()
      }, 300)
    })
    const search = searchApi(query).then((_res) => {
      let result_list = _res?.list || []
      if (mapFun) result_list = result_list.map(mapFun)
      list.value = result_list
      total.value = _res?.total || _res.list?.length || 0
      res.value = _res
    })
    Promise.all([search, timeout]).finally(() => {
      loading.value = false
    })
  }

  const immediateKey = ref(0)
  const debounceKey = ref(0)

  const search = () => {
    query.pageIndex = 1
    immediateKey.value++
    // refresh()
  }

  const reset = () => {
    const keys = Object.keys(query)
    const obj: any = {}
    keys.forEach((item) => {
      obj[item] = undefined
    })
    Object.assign(query, obj, initPageInfo, initQuery)
  }

  watch(
    () => ({ ...query }),
    (new_query, old_query) => {
      // console.log("new", new_query, "old", old_query)
      if (new_query.pageIndex === old_query.pageIndex && new_query.pageSize === old_query.pageSize) {
        if (new_query.pageIndex === 1) {
          // console.log("1")
          debounceKey.value++
        } else {
          // console.log("2")
          query.pageIndex = 1
        }
      } else {
        // console.log("3")
        immediateKey.value++
      }
    },
    { deep: true },
  )

  if (autoSearchDelay !== undefined)
    watchDebounced(
      debounceKey,
      () => {
        // console.log("4")
        refresh()
      },
      {
        deep: true,
        // immediate: true,
        debounce: autoSearchDelay,
        // maxWait: 1000
      },
    )

  watch(immediateKey, () => {
    // console.log("5")
    refresh()
  })

  return {
    list,
    refresh,
    total,
    loading,
    res,
    search,
    reset,
    query,
  }
}
