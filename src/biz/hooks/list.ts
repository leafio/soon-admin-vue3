import { ref, watch } from "vue"
import { watchDebounced } from "@vueuse/core"
import type { PageParams } from "@/api/types"

//分页查询
export function usePageList<
  R,
  T extends (args: PageParams) => Promise<{ list: R[]; total?: number }>,
  MapFun extends (item: Awaited<ReturnType<T>>["list"][0]) => R,
>({ searchApi, mapFun, initQuery, autoSearchDelay }: { searchApi: T; initQuery?: Parameters<T>[0]; mapFun?: MapFun; autoSearchDelay?: number }) {
  type Item = Awaited<ReturnType<T>>["list"][0]
  const list = ref<Item[]>([])
  const total = ref(0)
  const loading = ref(false)
  const initPageInfo: PageParams = { pageIndex: 1, pageSize: 10 }

  const query = reactive<Parameters<T>[0]>({ ...initPageInfo, ...initQuery })

  const pageInfo = reactive<PageParams>({ ...initPageInfo })
  const otherParams = reactive<any>({})

  watchEffect(() => {
    Object.keys(query).forEach((key) => {
      if (Object.keys(initPageInfo).includes(key)) {
        pageInfo[key as keyof PageParams] = query[key as keyof PageParams]
      } else {
        otherParams[key as string] = query[key as keyof Parameters<T>[0]]
      }
    })
  })

  //网络请求response原数据
  const resData = ref()

  const refresh = () => {
    loading.value = true

    const timeout = new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve()
      }, 300)
    })
    const search = searchApi(query).then((res) => {
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
    query.pageIndex = 1
    refresh()
  }

  const reset = () => {
    const keys = Object.keys(query)
    const obj: any = {}
    keys.forEach((item) => {
      obj[item] = undefined
    })
    Object.assign(query, obj, initPageInfo, initQuery)
  }

  if (autoSearchDelay !== undefined)
    watchDebounced(
      () => [otherParams],
      () => {
        if (pageInfo.pageIndex == 1) {
          refresh()
        } else {
          query.pageIndex = 1
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
        console.log("page-changed")
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
    loading,
    resData,
    search,
    reset,
    query,
  }
}
