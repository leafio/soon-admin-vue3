<template>
  <el-dropdown class="select-none" :show-timeout="70" :hide-timeout="50" trigger="click" @command="handleCommand">
    <div class="flex items-center">
      <img class="w-8 h-8 rounded-full mr-0.5" :src="user?.avatar ?? ''" alt="" />
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

import { tLocales } from "@/i18n"
import zh_logout from "@/i18n/locales/zh/logout"
import en_logout from "@/i18n/locales/en/logout"
import ko_logout from "@/i18n/locales/ko/logout"
import { useUserStore } from "@/store/modules/user"
import { resetStore } from "@/store"
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
      resetStore()
      router.push("/login")
    })
  }
}
</script>
