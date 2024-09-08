<template>
  <div class="relative min-h-[100vh]">
    <el-form ref="formRef" class="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 absolute md:right-[12.5%] top-1/4 p-4" size="large" :rules="rules" :model="form">
      <div class="flex justify-end">
        <LangSwitch icon-class="w-6 h-6" class="mb-4" />
      </div>
      <el-form-item prop="username">
        <el-input v-model="form.username" :placeholder="t('username') + ':  admin'"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="form.password" :placeholder="t('password') + ':  admin'" type="password"></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input v-model="form.code" :placeholder="t('code')">
          <template #append>
            <div ref="refImg" class="cursor-pointer" @click="refreshCaptcha" />
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
import { tMessages } from "@/i18n"
import { en_login } from "@/i18n/en/login"
import { zh_login } from "@/i18n/zh/login"
import { FormInstance } from "element-plus"

import LangSwitch from "@/layout/components/lang-switch.vue"
const t = tMessages({ zh: zh_login, en: en_login })

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
const handleLogin = () => {
  formRef.value?.validate((valid, fields) => {
    if (!valid) return
    login(form.value).then((res) => {
      localStorage.setItem("token", res.token)
      router.push("/")
    })
  })
}

const rules = computed(() => ({
  username: [{ required: true, message: t("error.username"), trigger: "blur" }],
  password: [{ required: true, message: t("error.password"), trigger: "blur" }],
  code: [{ required: true, message: t("error.code"), trigger: "blur" }],
}))
watch(
  () => rules.value,
  () => {
    nextTick(() => {
      setTimeout(() => {
        formRef.value?.clearValidate()
      })
    })
  },
)
</script>
<style scoped>
:deep(.el-input--large) {
  --el-input-height: 50px;
}
</style>
