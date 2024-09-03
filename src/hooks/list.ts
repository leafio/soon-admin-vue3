import { ref, watch } from "vue"
import { watchDebounced } from "@vueuse/core"

type ListHookProps<R, T extends (args: any) => Promise<{ list: R[]; total?: number }>, MapFun extends (item: Awaited<ReturnType<T>>["list"][0]) => R> = {
  searchApi: T
  excelApi?: (args: any) => Promise<any>
  initParams?: Parameters<T>[0]
  initPageInfo?: { pageIndex?: number; pageSize?: number }
  mapFun?: MapFun
  autoSearchDelay?: number
}
//分页查询
export function usePageList<
  R,
  T extends (args: any) => Promise<{ list: any[]; total?: number }>,
  MapFun extends (item: Awaited<ReturnType<T>>["list"][0]) => R,
>({ searchApi, excelApi, initPageInfo, mapFun, initParams, autoSearchDelay }: ListHookProps<R, T, MapFun>) {
  type Item = Awaited<ReturnType<T>>["list"][0]
  const list = ref<(R extends unknown ? Item : R)[]>([])
  const total = ref(0)
  const loading = ref(false)
  const params = reactive<NonNullable<Parameters<T>[0]>>({ ...initParams })
  const pageInfo = reactive(
    Object.assign(
      {
        pageIndex: 1,
        pageSize: 10,
      },
      initPageInfo,
    ),
  )
  //网络请求response原数据
  const resData = ref()

  const refresh = () => {
    loading.value = true

    const timeout = new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve()
      }, 300)
    })
    const search = searchApi({ ...params, ...pageInfo }).then((res) => {
      let result_list = res?.list || []
      if (mapFun) result_list = result_list.map(mapFun)
      list.value = result_list
      total.value = res?.total || res.list?.length || 0
      resData.value = res
    })
    Promise.all([search, timeout]).finally(() => {
      loading.value = false
    })
  }
  const search = () => {
    pageInfo.pageIndex = 1
    refresh()
  }

  const reset = () => {
    const keys = Object.keys(params)
    const obj: any = {}
    keys.forEach((item) => {
      obj[item] = undefined
    })
    Object.assign(params, obj, initParams)
  }

  const exportExcel = async () => {
    if (excelApi) {
      excelApi(params)
    }
  }
  if (autoSearchDelay !== undefined)
    watchDebounced(
      () => [params],
      () => {
        if (pageInfo.pageIndex == 1) {
          refresh()
        } else {
          pageInfo.pageIndex = 1
        }
      },
      {
        deep: true,
        // immediate: true,
        debounce: autoSearchDelay,
        // maxWait: 1000
      },
    )
  watch(
    () => pageInfo,
    (curVal, preVal) => {
      if (preVal) {
        refresh()
      }
    },
    {
      deep: true,
      immediate: true,
    },
  )

  return {
    list,
    refresh,
    total,
    exportExcel,
    loading,
    resData,
    search,
    reset,
    params,
    pageInfo,
  }
}
