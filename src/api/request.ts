import { ElMessage } from "element-plus"
import { createSoon, SoonOptions } from "soon-fetch"
import { parseBaseUrl } from "../../build/parse"
import { lang, tLocales } from "@/i18n"
import { refresh_token } from "./modules/auth"
import { createSilentRefresh } from "./addons/silentRefreshToken"
import { retry } from "./addons/retry"

export const baseURL = parseBaseUrl(import.meta.env, import.meta.env.DEV)
console.log(`baseURL: ${baseURL}`)
const t = tLocales()

const silentRefresh = createSilentRefresh(() =>
  refresh_token({ token: localStorage.getItem("refresh_token") ?? "" })
    .then((res) => {
      localStorage.setItem("token", res)
    })
    .catch(() => {
      localStorage.removeItem("token")
      localStorage.removeItem("refresh_token")
      location.href = "/login"
    }),
)

function request<T = any>(url: string, options: { headers: Headers; retries?: number | (() => boolean); delay?: number }) {
  return new Promise<T>(async (resolve, reject) => {
    try {
      const res = await fetch(url, options)
      if (res.ok) {
        if (res.headers.get("content-type")?.includes("json")) {
          const body = await res.json()
          if (body.code === 0) {
            resolve(body.data)
          } else {
            ElMessage.error(body.err ?? t("tip.requestError"))
            reject(body.err)
          }
        } else {
          resolve(res as any)
        }
      } else if (res.status === 401) {
        silentRefresh(resolve, reject, () => {
          options.headers.set("Authorization", localStorage.getItem("token") ?? "")
          return request(url, options)
        })
      } else {
        ElMessage.error(res.statusText)
        reject(res.statusText)
      }
    } catch (err: any) {
      if (err.name === "TimeoutError") {
        ElMessage.error(t("tip.requestTimeout"))
        reject(err)
      }
      // else if (err.name === "AbortError") {
      //  //message.error(err)
      // reject(err)
      // }
      else {
        if (
          !retry(
            (retries) => {
              resolve(request(url, { ...options, retries }))
            },
            options.retries,
            options.delay,
          )
        ) {
          reject(err)
        }
      }
    }
  })
}

export const soon = createSoon<SoonOptions & { retries?: number | (() => boolean); delay?: number }>({
  baseURL,
  baseOptions: () => {
    return {
      timeout: 20 * 1000,
      headers: new Headers({
        Authorization: localStorage.getItem("token") ?? "",
        "soon-lang": lang.value,
      }),
    }
  },
  fetching: (url, options) => request(url, options),
})
