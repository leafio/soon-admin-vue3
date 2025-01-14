import { createRouter, createWebHistory } from "vue-router"
import NProgress from "nprogress"
import "nprogress/nprogress.css"

import staticRoutes from "./routes/staticRoutes"
import dynamicRoutes from "./routes/dynamicRoutes"
import { startLoading, endLoading } from "@/biz/app/loading"
import { initRoutes } from "./init"
import { useAppStore } from "@/store/modules/app"
import { useUserStore } from "@/store/modules/user"

import type { Menu } from "@/api"
import { own_menus } from "@/api"

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

  // // 1.判断访问页面是否在路由白名单地址(静态路由)中，如果存在直接放行
  // console.log('1', to)
  if (to.name !== "notFound" && to.fullPath !== "/" && !to.meta.requiresAuth) return next()
  //   console.log('2',to.fullPath)

  // 2.判断是否有 token，没有重定向到 login 页面
  if (!token) {
    const query = to.fullPath === "/" ? undefined : { redirect: to.fullPath }
    return next({ path: appStore.route.loginUrl, replace: true, query })
  }
  // 3.如果没有菜单列表，就重新请求菜单列表并添加动态路由
  if (!userStore.menus) {
    // 前端写死路由
    userStore.menus = dynamicRoutes as Menu[]
    // 从后端获取路由
    await userStore.initUser()
    userStore.menus = await own_menus()

    const _menus = userStore.menus
    await initRoutes(_menus)

    //设置首页
    let homeUrl = appStore.route.homeUrl
    if (!appStore.route.homeUrl && _menus?.length) {
      homeUrl = (_menus[0].redirect as string | undefined) ?? (_menus[0].path as string)
      appStore.route.homeUrl = homeUrl
    }

    router.addRoute({
      path: "/",
      redirect: homeUrl,
    })

    return next({ path: to.fullPath, query: to.query, replace: true })
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
