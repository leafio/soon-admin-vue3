import { usePagedSearch } from "./search"

import type { PagedParams, PagedRes } from "@/api/types"

export function usePagedList<T extends (args: PagedParams) => Promise<PagedRes<any>>>({
  searchApi,
  initQuery,
  autoSearchDelay,
}: {
  searchApi: T
  initQuery?: Parameters<T>[0]
  autoSearchDelay?: number
}) {
  const _initQuery: Parameters<T>[0] = { pageIndex: 1, pageSize: 10, ...initQuery }
  const { refresh, data, loading, search, reset, query } = usePagedSearch(searchApi, _initQuery as any, {
    pager: {
      getter: (query) => ({ pageIndex: query?.pageIndex, pageSize: query?.pageSize }),
      setter: (query, index) => (query.pageIndex = index),
    },
    loadingDelay: 300,
    autoSearchDelay,
  })

  const list = computed<Awaited<ReturnType<T>>["list"]>(() => data.value?.list ?? [])
  const total = computed(() => data.value?.total ?? 0)

  return {
    list,
    total,
    refresh,
    loading,
    data,
    search,
    reset,
    query,
  }
}
