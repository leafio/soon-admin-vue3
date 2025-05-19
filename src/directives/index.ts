import type { App, Directive } from "vue"
import auth from "./modules/auth"
import scroll from "./modules/scroll"

const directives = {
  install: function (app: App<Element>) {
    // app.directive('auth', auth)
    // app.directive('scroll', scroll)
  },
}

export default directives
