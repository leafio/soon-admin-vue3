import { breakpointsTailwind, useBreakpoints } from "@vueuse/core"

export function useViewer() {
  const breakpoints = useBreakpoints(breakpointsTailwind)
  const smallerThanMd = breakpoints.smaller("md")
  return smallerThanMd.value ? "mobile" : "pc"
}
