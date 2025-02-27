import { watchDebounced } from "@vueuse/core"

export function useRequest<API extends () => Promise<any>>(
  api: API,
  options?: {
    loadingDelay?: number
  },
) {
  type ApiRes = Awaited<ReturnType<API>>
  // type APiQuery = Parameters<API>[0]

  const data = ref<ApiRes>()
  const loading = ref(false)
  const refresh = () => {
    loading.value = true
    const request = api().then((res) => {
      data.value = res
      loading.value = false
    })

    const promises: Promise<any>[] = [request]
    if (options?.loadingDelay) {
      const timeout = new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve()
        }, options.loadingDelay)
      })
      promises.push(timeout)
    }

    Promise.all(promises).finally(() => {
      loading.value = false
    })
  }

  return { data, loading, refresh }
}

export function useSearch<API extends (args: any) => Promise<any>>(api: API, initQuery: Parameters<API>[0], options?: { loadingDelay?: number }) {
  // function cloneOptions() {
  //     return JSON.parse(JSON.stringify(options)) as UseSearchOptions<API>
  // }

  function cloneInitQuery() {
    return JSON.parse(JSON.stringify({ data: initQuery })).data as Parameters<API>[0]
  }

  const query = ref(cloneInitQuery())

  const { data, loading, refresh } = useRequest(() => api(query.value) as ReturnType<API>, options)
  const reset = () => {
    query.value = cloneInitQuery()
  }
  return { data, loading, refresh, query, reset }
}

export function usePagedSearch<API extends (args: object) => Promise<any>>(
  searchApi: API,
  initQuery: Exclude<Parameters<API>[0], undefined>,
  options: {
    pager: {
      getter: (query: Exclude<Parameters<API>[0], undefined>) => { pageIndex: number | undefined; pageSize: number | undefined }
      setter: (query: Exclude<Parameters<API>[0], undefined>, pageIndex: number) => void
    }
    autoSearchDelay?: number
    loadingDelay?: number
  },
) {
  const { pager } = options

  const { data, loading, refresh, query, reset } = useSearch(
    searchApi as unknown as (args: Exclude<Parameters<API>[0], undefined>) => ReturnType<API>,
    initQuery,
    options,
  )

  const immediateKey = ref(0)
  const debounceKey = ref(0)

  const search = () => {
    pager.setter(query.value, 1)
    immediateKey.value++
    // refresh()
  }

  watch(
    () => query.value,
    (new_query, old_query) => {
      if (pager.getter(new_query).pageIndex === pager.getter(old_query).pageIndex && pager.getter(new_query).pageSize === pager.getter(old_query).pageSize) {
        if (pager.getter(new_query).pageIndex === 1) {
          if (options?.autoSearchDelay && options.autoSearchDelay > -1) {
            debounceKey.value++
          }
        } else {
          pager.setter(query.value, 1)
        }
      } else {
        immediateKey.value++
      }
    },
    { deep: true },
  )

  if (options?.autoSearchDelay !== undefined)
    watchDebounced(
      debounceKey,
      () => {
        refresh()
      },
      {
        deep: true,
        // immediate: true,
        debounce: options.autoSearchDelay,
        // maxWait: 1000
      },
    )

  watch(immediateKey, () => {
    refresh()
  })

  return {
    refresh,
    loading,
    data,
    search,
    reset,
    query,
  }
}
