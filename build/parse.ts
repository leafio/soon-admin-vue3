export function parseBaseUrl(env: any, isDev?: boolean) {
  const { DEV, VITE_API_URL, VITE_DEV_API_PREFIX, VITE_DEV_PROXY } = env
  let baseURL = VITE_API_URL
  console.log("proxy", VITE_DEV_PROXY)
  //如果是开发环境，并需要跨域代理
  if ((isDev || DEV) && VITE_API_URL.startsWith("http") && VITE_DEV_PROXY === "true") {
    const url = new URL(VITE_API_URL)
    // console.log("url", url)
    baseURL = url.pathname === "/" ? VITE_DEV_API_PREFIX : url.pathname
  }
  console.log({ isDev: !!(isDev || DEV), baseURL })
  return baseURL
}
