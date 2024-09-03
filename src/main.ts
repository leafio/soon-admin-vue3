import { createApp } from "vue"

import pinia from "@/store/index"
import App from "./App.vue"
import router from "@/router/index"
import directives from "./directives"

const app = createApp(App)
if (import.meta.env.DEV) {
  const ElementPlus = await import("element-plus")
  await import("element-plus/dist/index.css")
  app.use(ElementPlus)
}

import "element-plus/theme-chalk/el-message.css"
import "element-plus/theme-chalk/el-message-box.css"
import "./css/index.scss"

app.use(pinia).use(router).use(directives).mount("#app")
