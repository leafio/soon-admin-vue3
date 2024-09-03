export function parseBaseUrl(env: any, isDev?: boolean) {
  const { DEV, VITE_API_URL, VITE_DEV_API_PREFIX } = env
  let baseURL = VITE_API_URL
  if ((isDev || DEV) && VITE_API_URL.includes("http")) {
    const url = new URL(VITE_API_URL)
    baseURL = url.pathname === "/" ? VITE_DEV_API_PREFIX : url.pathname
  }
  console.log({ isDev: !!(isDev || DEV), baseURL })
  return baseURL
}
