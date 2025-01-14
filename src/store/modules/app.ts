import { defineStore } from "pinia"
export const DEFAULT_THEME_COLORS = {
  primary: "#8c57ff",
  success: "#67C23A",
  warning: "#E6A23C",
  // danger: "#F56C6C",
  info: "#909399",
  error: "#f56c6c",
}

export const useAppStore = defineStore("app", {
  persist: true,
  state: () => ({
    route: {
      loginUrl: "/login",
      homeUrl: "",
    },
    colors: {
      ...DEFAULT_THEME_COLORS,
    },
    sidebar: {
      isCollapse: false,
      isHide: false,
    },
    header: {
      isHide: false,
    },
    tabbar: {
      isHide: true,
    },
  }),
  actions: {},
})
