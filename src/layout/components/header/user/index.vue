<template>
  <el-dropdown class="select-none" :show-timeout="70" :hide-timeout="50" trigger="click" @command="handleCommand">
    <div class="flex items-center">
      <img class="w-8 h-8 rounded-full mr-0.5" :src="user?.avatar ?? ''" alt="" />
      {{ user?.username }}
      <BIconChevronDown />
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="pwd">{{ t("changePassword") }}</el-dropdown-item>
        <el-dropdown-item command="logout">{{ t("logout") }}</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
  <PwdDialog v-model="visible" />
</template>

<script setup lang="ts">
import { BIconChevronDown } from "bootstrap-icons-vue"
import PwdDialog from "./change-pwd.vue"

import { useUserStore } from "@/store/modules/user"
import { resetStore } from "@/store"
import { soon_local } from "@/biz/app/storage"

import { logout } from "@/api"

import { tLocales } from "@/i18n"
import zh_change_pwd from "@/i18n/locales/zh/auth/change-pwd"
import en_change_pwd from "@/i18n/locales/en/auth/change-pwd"
import ko_change_pwd from "@/i18n/locales/ko/auth/change-pwd"
import zh_logout from "@/i18n/locales/zh/auth/logout"
import en_logout from "@/i18n/locales/en/auth/logout"
import ko_logout from "@/i18n/locales/ko/auth/logout"
const t = tLocales({
  zh: { ...zh_change_pwd, ...zh_logout },
  en: { ...en_change_pwd, ...en_logout },
  ko: { ...ko_change_pwd, ...ko_logout },
})

const router = useRouter()
const user = useUserStore().userInfo

const visible = ref(false)
const handleCommand = (cmd: string) => {
  if (cmd === "logout") {
    logout().then(() => {
      ElMessage.success(t("loggedOut"))
      soon_local.refresh_token.remove()
      soon_local.token.remove()
      resetStore()
      router.push("/login")
    })
  } else if (cmd === "pwd") {
    visible.value = true
  }
}
</script>
