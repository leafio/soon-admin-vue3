import { defineStore } from "pinia"

/* KeepAliveState */
interface KeepAliveState {
  keepAliveNames: string[]
  refreshing: boolean
}

export const useKeepAliveStore = defineStore("keep-alive", {
  state: (): KeepAliveState => ({
    keepAliveNames: [],
    refreshing: false,
  }),
  actions: {
    // Add KeepAliveName
    async addKeepAliveName(name: string) {
      if (!this.keepAliveNames.includes(name)) this.keepAliveNames.push(name)
    },
    // Remove KeepAliveName
    async removeKeepAliveName(name: string) {
      this.keepAliveNames = this.keepAliveNames.filter((item) => item !== name)
    },
  },
})
