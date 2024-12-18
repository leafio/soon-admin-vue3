import { Menu, own_auth_codes, own_menus, own_userinfo, User } from "@/api"
import { parseMenusTitle, parseRedirectNext, initRoute } from "@/router/utils"
import router from "@/router/index"
import { defineStore } from "pinia"
import { useAppStore } from "./app"
import pinia from "@/store"

const appStore = useAppStore(pinia)

export const useUserStore = defineStore({
  id: "user",
  state: () => ({
    userInfo: null as User | null,
    token: "",
    menus: undefined as undefined | Menu[],
    btnList: [] as string[],
  }),
  actions: {
    async initUser() {
      if (!this.userInfo) {
        this.userInfo = await own_userinfo()
        this.btnList = await own_auth_codes()
      }
    },

    async initRoutes(menus?: Menu[]) {
      console.log("init-routes")
      await this.initUser()

      let _menus = menus ?? (await own_menus()) ?? []
      // i18n title
      _menus = parseMenusTitle(_menus)
      //dynamic redirect
      _menus = parseRedirectNext(_menus)

      if (!appStore.route.homeUrl && _menus?.length) {
        appStore.route.homeUrl = (_menus[0].redirect as string | undefined) ?? (_menus[0].path as string)
        router.addRoute({
          path: "/",
          redirect: appStore.route.homeUrl,
        })
      }

      this.menus = (await initRoute(_menus)) as any
    },
  },
})
