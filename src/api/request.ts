import { ElMessage } from "element-plus"
import { createSoon, SoonOptions } from "soon-fetch"
import { parseBaseUrl } from "../../build/parse"
import { lang, tLocales } from "@/i18n"

export const baseURL = parseBaseUrl(import.meta.env, import.meta.env.DEV)
console.log(`baseURL: ${baseURL}`)

const t = tLocales()

export const soon = createSoon<SoonOptions>({
  baseURL: baseURL,
  options: () => ({
    timeout: 20 * 1000,
    headers: new Headers({
      Authorization: localStorage.getItem("token") ?? "",
      "soon-lang": lang.value,
    }),
  }),
  fetching: (url, options) => {
    return new Promise((resolve, reject) => {
      fetch(url, options)
        .then(async (res) => {
          if (res.ok) {
            if (res.headers.get("content-type")?.includes("json")) {
              const body = await res.json()
              if (body.code === 0) {
                resolve(body.data)
              } else {
                ElMessage.error(body.err ?? "Invalid JSON Response")
                reject(body.err)
              }
            } else {
              resolve(res)
            }
          } else {
            if (res.status === 401) {
              localStorage.removeItem("token")
              location.href = "/login"
            }
            ElMessage.error(res.statusText)
            reject(res.statusText)
          }
        })
        .catch((err) => {
          if (err.name === "TimeoutError") {
            ElMessage.error(t("tip.requestTimeout"))
          }
          // else if (err.name === "AbortError") {
          //   // message.error(err)
          // }
          reject(err)
        })
    })
  },
})
