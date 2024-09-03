<template>
  <el-dropdown class="cursor-pointer" :show-timeout="70" :hide-timeout="50" trigger="click" @command="handleCommand">
    <div class="flex items-center">
      <img class="w-8 h-8 rounded-full" :src="user?.avatar ?? ''" alt="" />
      {{ user?.username }}
      <BIconChevronDown />
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="logout">{{ t("logout") }}</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { BIconChevronDown } from "bootstrap-icons-vue"
import { logout } from "@/api"
import { useUserStore } from "@/store/modules/user"
import { tMessages } from "@/i18n"
import { useTabsStore } from "@/store/modules/tabs"
import { useKeepAliveStore } from "@/store/modules/keepAlive"
import { useAppStore } from "@/store/modules/app"
const t = tMessages({
  "zh-cn": {
    logout: "退出登录",
    loggedOut: "已退出!",
  },
  en: {
    logout: "Logout",
    loggedOut: "Successfully logged out !",
  },
})

const router = useRouter()
const user = useUserStore().userInfo
const handleCommand = (cmd: string) => {
  if (cmd === "logout") {
    logout().then(() => {
      ElMessage.success(t("loggedOut"))
      localStorage.clear()
      useUserStore().$reset()
      useTabsStore().$reset()
      useKeepAliveStore().$reset()
      useAppStore().$reset()

      router.push("/login")
    })
  }
}
</script>
