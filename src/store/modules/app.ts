import { defineStore } from "pinia"

export const useAppStore = defineStore("app", {
  state: () => ({
    responsive: "pc" as "pc" | "mobile",
    route: {
      loginUrl: "/login",
      homeUrl: "",
    },
    sideBar: {
      isCollapse: false,
      isHide: false,
    },
  }),
  actions: {},
})
