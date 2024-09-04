import { ElMessage } from "element-plus"
import { createSoon, SoonOptions } from "soon-fetch"
import { parseBaseUrl } from "../../build/parse"
import { lang, tMessages } from "@/i18n"

export const baseURL = parseBaseUrl(import.meta.env)
console.log(`baseURL: ${baseURL}`)

const t = tMessages()

export const soon = createSoon<SoonOptions>({
  baseURL: baseURL,
  defaultOptions: () => ({
    timeout: 20 * 1000,
    headers: new Headers({
      Authorization: localStorage.getItem("token") ?? "",
      "soon-lang": lang.value,
    }),
  }),
  afterResponse: async (result, resolve, reject) => {
    const res = result.response
    if (res) {
      if (res.ok) {
        if (res.headers.get("content-type")?.includes("json")) {
          const body = await res.json()
          if (body.code === 0) {
            resolve(body.data)
          } else {
            ElMessage.error(body.err ?? "Invalid JSON Response")
          }
        }
      } else if (res.status === 401) {
        localStorage.removeItem("token")
        location.href = "/login"
      } else {
        ElMessage.error(res.statusText)
      }
    } else if (result.isTimeout) {
      ElMessage.error(t("tip.requestTimeout"))
    } else if (result.error) {
      ElMessage.error(result.error)
    }
    reject()
  },
})
