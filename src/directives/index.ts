import type { App, Directive } from "vue"

import waterMarker from "./modules/waterMarker"
import draggable from "./modules/draggable"

import longpress from "./modules/longpress"
// import scroll from "./modules/scoll"

const directivesList: { [key: string]: Directive } = {
  waterMarker,
  draggable,

  longpress,
  // scroll,
}

const directives = {
  install: function (app: App<Element>) {
    Object.keys(directivesList).forEach((key) => {
      app.directive(key, directivesList[key])
    })
  },
}

export default directives
