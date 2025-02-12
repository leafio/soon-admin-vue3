import { createRouter, createWebHistory } from "vue-router"
import NProgress from "nprogress"
import "nprogress/nprogress.css"

import { PAGE_404_NAME, PAGE_LOGIN_URL, staticRoutes } from "./routes/staticRoutes"
import dynamicRoutes from "./routes/dynamicRoutes"
import { startLoading, endLoading } from "@/biz/app/loading"

import { useAppStore } from "@/store/modules/app"
import { useUserStore } from "@/store/modules/user"

import { own_menus } from "@/api"
import type { SoonMenu } from "@/layout/components/aside/menu/type"
import { parseRedirectNext, parseRoutesComponent } from "./utils"
import pinia from "@/store/instance"
import { soon_local } from "@/biz/app/storage"

export const router = createRouter({
  history: createWebHistory(),
  routes: [...staticRoutes],
})
console.log("init-route")

NProgress.configure({ showSpinner: false })

// 路由加载前
router.beforeEach(async (to, from, next) => {
  // console.log("from", from, "to", to)

  NProgress.start()
  startLoading()
  const token = soon_local.token.get()
  const userStore = useUserStore(pinia)
  const appStore = useAppStore(pinia)

  //1.根目录跳转 首页
  if (to.fullPath === "/" && appStore.route.homeUrl && appStore.route.homeUrl !== "/") {
    return next({ path: appStore.route.homeUrl })
  }

  //2.找不到路由
  if (to.name == PAGE_404_NAME) {
    // 路由未加载,加载路由
    if (!userStore.menus) {
      // token 不存在 跳转至登录页，并添加当前路由至redirect参数
      if (!token) {
        const redirect = to.fullPath === "/" ? undefined : to.fullPath
        return next({ path: PAGE_LOGIN_URL, replace: true, query: { redirect } })
      }

      // token 存在
      //刷新用户资料
      await userStore.initUser()

      // 获取路由
      // 前端写死路由
      // userStore.menus = dynamicRoutes as SoonMenu[]
      // 从后端获取路由
      userStore.menus = await own_menus()

      //动态 redirect 父级目录设置redirect:toNext 默认跳转第一个子目录，如不需要可注释掉
      let _menus = parseRedirectNext(userStore.menus)

      //如果前端写死的路由 没有使用meta.layout,可注释掉
      _menus = parseRoutesComponent(_menus)

      //添加页面至router
      _menus.forEach((item) => {
        if (item.meta?.layout) {
          router.addRoute(item.meta.layout, item)
        } else {
          router.addRoute(item)
        }
      })

      //动态设置首页为第一个路由，不需要可注释掉
      let homeUrl = appStore.route.homeUrl
      if (!appStore.route.homeUrl && _menus?.length) {
        homeUrl = (_menus[0].redirect as string | undefined) ?? (_menus[0].path as string)
        appStore.route.homeUrl = homeUrl
      }

      //重新转向至当前路由
      return next({ path: to.fullPath, query: to.query, replace: true })
    }
  }
  //2.路由要求权限
  if (to.meta.requiresAuth) {
    if (!token) {
      return next({ path: PAGE_LOGIN_URL, replace: true, query: { redirect: to.fullPath } })
    }
  }

  // 3.正常访问页面
  next()
})

// 路由加载后
router.afterEach(() => {
  NProgress.done()
  endLoading()
})

// 导出路由
export default router
