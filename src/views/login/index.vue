<template>
  <div class="relative min-h-[100vh]">
    <el-form ref="formRef" class="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 absolute md:right-[12.5%] top-1/4 p-4" size="large" :rules="rules" :model="form">
      <div class="flex justify-end">
        <LangSwitch icon-class="w-6 h-6" class="mb-4" />
      </div>
      <el-form-item :prop="rulesKey.username">
        <el-input v-model="form.username" autofocus :placeholder="t('username') + ':  admin'" @keyup.enter="handleLogin"></el-input>
      </el-form-item>
      <el-form-item :prop="rulesKey.password">
        <el-input v-model="form.password" show-password :placeholder="t('password') + ':  admin'" type="password" @keyup.enter="handleLogin"></el-input>
      </el-form-item>
      <el-form-item :prop="rulesKey.code">
        <el-input v-model="form.code" :placeholder="t('code')" @keyup.enter="handleLogin">
          <template #append>
            <div ref="refImg" class="cursor-pointer min-w-24" @click="refreshCaptcha" />
          </template>
        </el-input>
      </el-form-item>
      <div class="flex justify-end">
        <el-button class="w-full md:w-1/3" size="large" type="primary" @click="handleLogin">{{ t("login") }}</el-button>
      </div>
    </el-form>
  </div>
</template>
<script setup lang="ts">
import { getCaptcha, login } from "@/api"
import { tLocales } from "@/i18n"

import type { FormInstance } from "element-plus"

import LangSwitch from "@/components/lang-switch.vue"

import { useKeys } from "@/biz"
import { soon_local } from "@/biz/app/storage"
import zh_login from "@/i18n/locales/zh/auth/login"
import en_login from "@/i18n/locales/en/auth/login"
import ko_login from "@/i18n/locales/ko/auth/login"

const t = tLocales({ zh: zh_login, en: en_login, ko: ko_login })

const form = ref({
  username: "",
  password: "",
  codeId: -1,
  code: "",
})
const refImg = ref()
const refreshCaptcha = () => {
  getCaptcha().then((res) => {
    refImg.value.innerHTML = res.img
    form.value.codeId = res.id
  })
}
onMounted(() => {
  refreshCaptcha()
})

const formRef = ref<FormInstance>()
const router = useRouter()
const route = useRoute()
const handleLogin = () => {
  formRef.value?.validate((valid, fields) => {
    if (!valid) return
    login(form.value).then((res) => {
      soon_local.token.set(res.token)
      soon_local.refresh_token.set(res.refreshToken)
      router.push((route.query.redirect ?? "/") as string)
    })
  })
}

const rules = computed(() => ({
  username: [{ required: true, message: t("error.username"), trigger: "blur" }],
  password: [{ required: true, message: t("error.password"), trigger: "blur" }],
  code: [{ required: true, message: t("error.code"), trigger: "blur" }],
}))

const rulesKey = useKeys(rules.value)

watch(rules, () => {
  setTimeout(() => {
    formRef.value?.clearValidate()
  })
})
</script>
<style scoped>
:deep(.el-input--large) {
  --el-input-height: 50px;
}

:deep(.el-input-group__append) {
  padding: 0;
}
</style>
