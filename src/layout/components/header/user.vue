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
import { tLocales } from "@/i18n"
import { useTabsStore } from "@/store/modules/tabs"
import { useKeepAliveStore } from "@/store/modules/keepAlive"
import { useAppStore } from "@/store/modules/app"
import zh_logout from "@/i18n/zh/logout"
import en_logout from "@/i18n/en/logout"
import ko_logout from "@/i18n/ko/logout"
const t = tLocales({
  zh: zh_logout,
  en: en_logout,
  ko: ko_logout,
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
