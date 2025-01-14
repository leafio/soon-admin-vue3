import type { Menu } from "@/api"
import { own_menus } from "@/api"
import { parseRedirectNext, parseRoutesComponent } from "./utils"
import router from "@/router/index"

export async function initRoutes(menus: Menu[]) {
  //dynamic redirect
  const _menus = parseRedirectNext(menus)

  const parsed = parseRoutesComponent(_menus)
  parsed.forEach((item) => {
    if (item.meta?.layout) {
      router.addRoute(item.meta.layout, item)
    } else {
      router.addRoute(item)
    }
  })

  return parsed
}
