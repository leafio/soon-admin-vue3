import { defineConfig, loadEnv } from "vite"
import vue from "@vitejs/plugin-vue"
import vueJsx from "@vitejs/plugin-vue-jsx"
import path from "path"
import svgLoader from "vite-svg-loader"
import { visualizer } from "rollup-plugin-visualizer"

import AutoImport from "unplugin-auto-import/vite"
import Components from "unplugin-vue-components/vite"
import { ElementPlusResolver } from "unplugin-vue-components/resolvers"
//@ts-ignore
import { parseBaseUrl } from "./build/parse"

//@ts-ignore
import eslintPlugin from "vite-plugin-eslint"

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const root = process.cwd()
  const env = loadEnv(mode, root)
  console.log(mode, env)
  const isDev = process.env.NODE_ENV === "development"
  const createDevProxy = () => {
    if (isDev && env.VITE_DEV_PROXY == "true" && env.VITE_API_URL.includes("http")) {
      const prefix = parseBaseUrl(env, isDev)
      return {
        [prefix]: {
          target: env.VITE_API_URL,
          ws: true,
          changeOrigin: true,
          rewrite: (path: string) => path.replace(new RegExp(`^${prefix}`), ""),
        },
      }
    }
  }

  return {
    plugins: [
      vue(),
      vueJsx(),
      svgLoader(),
      AutoImport({
        imports: ["vue", "vue-router", "pinia"],
        resolvers: [ElementPlusResolver({ importStyle: isDev ? undefined : "sass" })],
        dts: "./types/auto-imports.d.ts",
      }),

      Components({
        dirs: [],
        resolvers: [ElementPlusResolver({ importStyle: isDev ? undefined : "sass" })],
        dts: "./types/components.d.ts",
      }),
      eslintPlugin(),
      env.ANALYZE === "true"
        ? visualizer({
            open: true, //注意这里要设置为true，否则无效
            filename: "stats.html", //分析图生成的文件名
            gzipSize: true, // 收集 gzip 大小并将其显示
            brotliSize: true, // 收集 brotli 大小并将其显示
          })
        : undefined,
    ],
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern-compiler", // or 'modern'
        },
      },
    },

    server: {
      // 端口号
      port: Number(env.VITE_PORT),
      host: "0.0.0.0",
      open: true,
      // 本地跨域代理 https://cn.vitejs.dev/config/server-options.html#server-proxy
      proxy: createDevProxy(),
      // {
      //   "/api": {
      //     target: "http://localhost:8090",
      //     ws: true,
      //     changeOrigin: true,
      //     rewrite: (path) => path, //.replace(/^\/api/, ''),
      //   },
      // }
      // 预热文件以提前转换和缓存结果，降低启动期间的初始页面加载时长并防止转换瀑布
      warmup: {
        clientFiles: ["./index.html", "./src/{views,components,layout}/*"],
      },
    },
    resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
  }
})
