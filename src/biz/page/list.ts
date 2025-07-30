import { useSearch } from "./search"
import type { Simplify } from "type-fest"
import type { PagedParams, ReqOpts } from "@/api/types"

export function usePagedList<T extends (query?: PagedParams, options?: ReqOpts) => Promise<{ list: any[]; total?: number }>>(
  api: T,
  options?: {
    initQuery?: Simplify<Omit<Exclude<Parameters<T>[0], undefined>, "pageIndex" | "pageSize">>
    initPager?: Partial<PagedParams>
  } & Parameters<T>[1] &
    Parameters<typeof useSearch<T>>[1],
) {
  const { initQuery, initPager } = options ?? {}
  type Args = Parameters<T>
  type DataItem = Awaited<ReturnType<T>>["list"][0]
  const list = ref<DataItem[]>([])
  const total = ref(0)
  const aborts: AbortController[] = []

  const { loading, search: run, isFetching } = useSearch(api, options)
  const query = ref(structuredClone(initQuery) ?? ({} as Exclude<typeof initQuery, undefined>))
  const pager = ref(structuredClone(initPager) ?? ({} as Exclude<typeof initPager, undefined>))
  const search = (...args: Args) => {
    run(...([args[0], { aborts, ...args[1] }] as unknown as Args)).then((res) => {
      list.value = res.list
      total.value = res.total || res.list?.length || 0
    })
  }

  const refresh = (resetPageIndex?: boolean) => {
    if (resetPageIndex === true) {
      pager.value.pageIndex = 1
    }
    search(...([{ ...query.value, ...pager.value }] as unknown as Args))
  }

  const reset = () => {
    const cloned_query = structuredClone(initQuery) ?? {}
    const cloned_pager = structuredClone(initPager) ?? {}
    query.value = cloned_query
    pager.value = cloned_pager
    search(...([{ ...cloned_query, ...cloned_query }] as unknown as Args))
  }

  return {
    list,
    total,
    loading,
    search,
    query,
    pager,
    refresh,
    reset,
    isFetching,
  }
}
