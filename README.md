# Soon-Admin

### 介绍 📖

Soon-Admin 是一套完全以typescript开发的后台管理系统。

- 🧑‍🤝‍🧑前端 soon-admin-vue3`(本项目)`

- 👭后端 [soon-admin-express](https://github.com/leafio/soon-admin-express)

### 项目功能 🔨

- Vue3.4 + TypeScript 开发，单文件组件**＜script setup＞**
- 采用 Vite 5 作为项目开发、打包工具
- 样式采用 scss 和 Tailwind Css
- 使用 unplugin-auto-import unplugin-vue-components 自动导入element-plus 组件
- 采用 Pinia 作为状态管理
- 使用 soon-fetch进行http请求,不到3K
- 使用 grig实现i18n,有良好的type提示约束,不到3K
- 使用 soon-mock 可视化配置模拟API
- 使用 vue-router 配置动态路由权限拦截、路由懒加载，支持页面按钮权限控制
- 使用 KeepAlive 对页面进行缓存，支持多级嵌套路由缓存
- 移动端适配完善，表格在移动端展示为卡片形式
- 使用 Prettier 统一格式化代码，集成 ESLint代码校验规范
- 使用 husky、lint-staged 规范提交信息

### 截图

![pc](https://raw.githubusercontent.com/leafio/soon-admin-vue3/main/public/pc.png)
![mobile](https://raw.githubusercontent.com/leafio/soon-admin-vue3/main/public/mobile.png)

### 安装使用步骤 📔

- **Clone：**

```text
git clone https://github.com/leafio/soon-admin-vue3.git
```

- **Install：**

```text
yarn install
```

- **Run：**

1.  普通dev模式 (需开启后端项目进行连接)

```text
yarn dev
```

2.  mock dev模式（会自动启动并连接本地mock服务器）

```text
yarn dev:mock
```

- **Build：**

```text
# 开发环境
yarn build:dev

# 生产环境
yarn build
```

- **Lint：**

```text
# eslint 检测代码
yarn lint:eslint

# prettier 格式化代码
yarn lint:prettier
```

### 文件资源目录 📚

```text
Soon-Admin-Vue3
├─ .husky                  # husky 配置文件
├─ build                   # Vite 配置项
├─ mock                    # soon-mock 配置及数据文件
├─ public                  # 静态资源文件（该文件夹不会被打包）
├─ src
│  ├─ api                  # API 接口管理
│  ├─ assets               # 静态资源文件
│  ├─ components           # 全局组件
│  ├─ css                  # 全局样式文件
│  ├─ directives           # 全局指令文件
│  ├─ hooks                # 常用 Hooks 封装
│  ├─ i18n                 # 语言国际化 i18n
│  ├─ layout               # 框架布局模块
│  ├─ router               # 路由管理
│  ├─ store                # pinia store
│  ├─ utils                # 常用工具库
│  ├─ views                # 项目所有页面
│  ├─ App.vue              # 项目主组件
│  └─ main.ts              # 项目入口文件
├─  types                  # 全局 ts 声明
├─ .env                    # vite 常用配置
├─ .env.development        # 开发环境配置
├─ .env.mock               # 本地Mock环境配置
├─ .env.production         # 生产环境配置
├─ .gitignore              # 忽略 git 提交
├─ .prettierignore         # 忽略 Prettier 格式化
├─ CHANGELOG.md            # 项目更新日志
├─ eslint.config.js        # Eslint 校验配置文件
├─ index.html              # 入口 html
├─ package.json            # 依赖包管理
├─ postcss.config.js       # postcss 配置
├─ prettier.config.js      # Prettier 格式化配置
├─ README.md               # README 介绍
├─ tsconfig.json           # typescript 全局配置
└─ vite.config.ts          # vite 全局配置文件

```

### 浏览器支持 🌎

- 本地开发推荐使用 Chrome 最新版浏览器 [Download](https://www.google.com/intl/zh-CN/chrome/)。
- 生产环境支持现代浏览器，不再支持 IE 浏览器，更多浏览器可以查看 [Can I Use Es Module](https://caniuse.com/?search=ESModule)。

| ![Edge](https://i.imgtg.com/2023/04/11/8zr3p.png) | ![Firefox](https://i.imgtg.com/2023/04/11/8zKiU.png) | ![Chrome](https://i.imgtg.com/2023/04/11/8zNrx.png) | ![Safari](https://i.imgtg.com/2023/04/11/8zeGj.png) |
| :-----------------------------------------------: | :--------------------------------------------------: | :-------------------------------------------------: | :-------------------------------------------------: |
|                  last 2 versions                  |                   last 2 versions                    |                   last 2 versions                   |                   last 2 versions                   |

### 项目支持 🍵

如果你正在使用这个项目或者喜欢这个项目的，可以通过以下方式支持我：

- Star、Fork、Watch 一键三连 🚀

Email: leafnote@outlook.com
