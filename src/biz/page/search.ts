export function useSearch<T extends (...args: any) => Promise<any>>(
  api: T,
  options?: {
    loadingDelay?: number
    minLoadingInterval?: number
  },
) {
  type Args = Parameters<T>
  type Data = Awaited<ReturnType<T>>

  const loading = ref(false)
  const data = ref<Data>()
  const isFetching = ref(false)
  const search = (...args: Args) => {
    const promise_loading = new Promise<void>((resolve, reject) => {
      const startLoading = () => {
        loading.value = true
        setTimeout(() => {
          resolve()
        }, options?.minLoadingInterval ?? 300)
      }
      if (options?.loadingDelay) {
        setTimeout(() => {
          startLoading()
        }, options.loadingDelay)
      } else {
        startLoading()
      }
    })
    isFetching.value = true

    const promise_fetch: Promise<Data> = api(...args)
      .then((res) => {
        data.value = res
        return res
      })
      .finally(() => {
        isFetching.value = false
      })
    Promise.allSettled([promise_fetch, promise_loading]).finally(() => {
      loading.value = false
    })
    return promise_fetch
  }
  return { loading, search, isFetching, data }
}
