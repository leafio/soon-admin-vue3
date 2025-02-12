import { createApp } from "vue"

import pinia from "@/store/instance"
import App from "./App.vue"
import router from "@/router/index"
import directives from "./directives"

const app = createApp(App)

if (import.meta.env.DEV) {
  await import("element-plus/dist/index.css")
}

app.use(pinia).use(router).use(directives).mount("#app")

import("./css/index.scss")
