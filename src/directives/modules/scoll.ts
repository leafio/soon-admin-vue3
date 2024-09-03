import PerfectScrollbar from "perfect-scrollbar"
import { DirectiveBinding, VNode } from "vue"
import "perfect-scrollbar/css/perfect-scrollbar.css"

const scroll = {
  mounted(el: Element, binding: DirectiveBinding, vnode: VNode) {
    el.classList.add("relative")
    //@ts-ignore
    el.ps = new PerfectScrollbar(el)
  },
  updated(el: Element, binding: DirectiveBinding, vnode: VNode) {
    //@ts-ignore
    el.ps.update()
  },
}

export default scroll
