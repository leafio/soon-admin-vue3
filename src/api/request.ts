import { parseBaseUrl } from "../../build/parse"
import { refresh_token } from "./modules/auth"
import { createSilentRefresh } from "./addons/silentRefreshToken"
import type { SoonOptions } from "soon-fetch"
import { createSoon, parseUrlOptions } from "soon-fetch"
import isNetworkError from "is-network-error"

import { lang, tLocales } from "@/i18n"
import { soon_local } from "@/biz/app/storage"

export const baseURL = parseBaseUrl(import.meta.env, import.meta.env.DEV)
console.log(`baseURL: ${baseURL}`)
const t = tLocales()

const silentRefresh = createSilentRefresh(() =>
  refresh_token({ token: soon_local.refresh_token.get() ?? "" })
    .then((res) => {
      soon_local.token.set(res.token)
    })
    .catch(() => {
      soon_local.token.remove()
      soon_local.refresh_token.remove()
      location.href = "/login"
    }),
)
type RequestOptions = SoonOptions & {
  retryLimit?: number
  retryCondition?: (result?: { data?: any; res?: Response; err?: any }) => boolean
  retryDelay?: number
  toastErr?: boolean
}

function request<T = any>(url: string, options?: RequestOptions) {
  return new Promise<T>(async (resolve, reject) => {
    const [_url, _options] = parseUrlOptions({
      url,
      options,
      baseURL,
      baseOptions: {
        timeout: 20 * 1000,
        headers: new Headers({
          Authorization: soon_local.token.get() ?? "",
          "soon-lang": lang.value,
        }),
      },
    })

    let res,
      err,
      data,
      errMsg = "",
      is_net_err = false

    try {
      res = await fetch(_url, _options)
    } catch (error: any) {
      err = error
      is_net_err = isNetworkError(error)
    }

    if (res) {
      if (res.ok) {
        if (res.headers.get("content-type")?.includes("json")) {
          const body = await res.json()
          if (body.code === 0) {
            data = body.data
          } else {
            errMsg = body.err ?? t("tip.requestError")
            err = body.err
          }
        } else {
          data = res
        }
      } else if (res.status === 401) {
        silentRefresh(() => resolve(request(url, options)))
        return
      } else {
        errMsg = res.statusText
        err = res.statusText
      }
    }

    //重试

    const { retryLimit, retryCondition, retryDelay } = options || {}
    const retry = retryLimit && (retryCondition ? retryCondition({ data, res, err }) : is_net_err)
    if (retry) {
      setTimeout(() => resolve(request(url, { ...options, retryLimit: retryLimit - 1 })), retryDelay)
      return
    }

    if (err) {
      if (err.name === "TimeoutError") {
        errMsg = t("tip.requestTimeout")
      }
      // else if (err.name === "AbortError") {
      //  //message.error(err)
      // reject(err)
      // }
    }

    //完成promise
    if (err) {
      reject(err)
    } else {
      resolve(data)
    }

    //显示错误信息
    const showErrToast = options?.toastErr ?? true
    if (showErrToast && errMsg) {
      ElMessage.error(errMsg)
    }
  })
}

export const soon = createSoon(request)
