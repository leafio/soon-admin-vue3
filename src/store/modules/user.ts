import type { Menu, User } from "@/api"
import { own_auth_codes, own_menus, own_userinfo } from "@/api"
import { defineStore } from "pinia"

export const useUserStore = defineStore("user", {
  state: () => ({
    userInfo: null as User | null,
    token: "",
    menus: undefined as undefined | Menu[],
    btnList: [] as string[],
  }),
  actions: {
    initUser() {
      const promises = []
      if (!this.userInfo) {
        promises.push(
          own_userinfo().then((res) => (this.userInfo = res)),
          own_auth_codes().then((res) => (this.btnList = res)),
        )
      }
      if (!this.menus) {
        promises.push(own_menus().then((res) => (this.menus = res)))
      }
      return Promise.all(promises)
    },
  },
})
