import { breakpointsTailwind, useBreakpoints } from "@vueuse/core"

function useViewer() {
  const breakpoints = useBreakpoints(breakpointsTailwind)
  const smallerThanMd = breakpoints.smaller("md")
  return smallerThanMd.value ? "mobile" : "pc"
}

export function useMobile() {
  const isMobile = computed(() => useViewer() === "mobile")
  const paginationSize = computed(() => (useViewer() === "mobile" ? "small" : ""))
  return {
    isMobile,
    paginationSize,
  }
}
