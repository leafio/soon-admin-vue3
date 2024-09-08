import { createRouter, createWebHistory } from "vue-router"
import NProgress from "nprogress"
import "nprogress/nprogress.css"

import { useUserStore } from "@/store/modules/user"
import { staticRoutes, bizRoutes } from "./routes"
import { startLoading, endLoading } from "@/utils/loading"
import { useAppStore } from "@/store/modules/app"

const ROUTER_WHITE_LIST: string[] = []

export const router = createRouter({
  history: createWebHistory(),
  routes: [...staticRoutes],
})

NProgress.configure({ showSpinner: false })

// 路由加载前
router.beforeEach(async (to, from, next) => {
  // console.log("from", from, "to", to)

  NProgress.start()
  startLoading()
  const token = localStorage.getItem("token")
  const userStore = useUserStore()
  const appStore = useAppStore()

  // 1.判断访问页面是否在路由白名单地址(静态路由)中，如果存在直接放行
  if (ROUTER_WHITE_LIST.includes(to.path)) return next()

  // 2.判断是访问登陆页，有 token 就在当前页面，没有 token 重置路由到登陆页
  if (to.path.toLocaleLowerCase() === appStore.route.loginUrl) {
    if (token) return next(from.fullPath)
    // resetRouter();
    return next()
  }

  // 3.判断是否有 token，没有重定向到 login 页面
  if (!token) return next({ path: appStore.route.loginUrl, replace: true })

  // 4.如果没有菜单列表，就重新请求菜单列表并添加动态路由
  if (!userStore.menus) {
    // 前端写死路由
    // await userStore.initRoutes(bizRoutes as any)
    // 从后端获取路由
    await userStore.initRoutes()
    return next({ path: to.fullPath, replace: true })
  }

  // 5.正常访问页面
  next()
})

// 路由加载后
router.afterEach(() => {
  NProgress.done()
  endLoading()
})

// 导出路由
export default router
