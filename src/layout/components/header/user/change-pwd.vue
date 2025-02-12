<template>
  <el-dialog v-model="isShowDialog" width="36em" :title="t('changePassword')">
    <el-form ref="formRef" :rules="rules" label-width="15em" :model="form">
      <el-form-item :label="t('originalPassword')" :prop="rulesKey.password">
        <el-input v-model="form.password" type="password" class="w-80" show-password></el-input>
      </el-form-item>
      <el-form-item :label="t('newPassword')" :prop="rulesKey.new_password">
        <el-input v-model="form.new_password" type="password" class="w-80" show-password></el-input>
      </el-form-item>
      <el-form-item :label="t('confirmPassword')" :prop="rulesKey.confirm_new_password">
        <el-input v-model="form.confirm_new_password" type="password" class="w-80" show-password></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button size="default" @click="onCancel">{{ t("cancel") }}</el-button>
      <el-button type="primary" size="default" @click="onSubmit">{{ t("confirm") }}</el-button>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { change_pwd } from "@/api"
import type { FormInstance } from "element-plus"

import { tLocales } from "@/i18n"
import zh_change_pwd from "@/i18n/locales/zh/auth/change-pwd"
import en_change_pwd from "@/i18n/locales/en/auth/change-pwd"
import ko_change_pwd from "@/i18n/locales/ko/auth/change-pwd"
import { useKeys } from "@/biz"

const t = tLocales({ zh: zh_change_pwd, en: en_change_pwd, ko: ko_change_pwd })
const defaultValue = {
  password: "",
  new_password: "",
  confirm_new_password: "",
}
const form = ref(defaultValue)

const isShowDialog = defineModel<boolean>()
const validPassword = (rule: any, value: any, callback: any) => {
  if (value !== form.value.new_password) {
    callback(new Error(t("error.passwordNotMatch")))
  } else {
    callback()
  }
}
const rules = {
  password: [{ required: true, message: t("error.originalPassword"), trigger: "blur" }],
  new_password: [{ required: true, message: t("error.newPassword"), trigger: "blur" }],
  confirm_new_password: [
    { required: true, message: t("error.confirmPassword"), trigger: "blur" },
    { validator: validPassword, trigger: "blur" },
  ],
}
const rulesKey = useKeys(rules)

const onCancel = () => {
  isShowDialog.value = false
}

const formRef = ref<FormInstance>()
watchEffect(() => {
  if (!isShowDialog.value) {
    form.value = { ...defaultValue }
    formRef.value?.clearValidate()
  }
})
const onSubmit = () => {
  formRef.value?.validate((valid) => {
    if (valid) {
      change_pwd({
        password: form.value.password,
        new_password: form.value.new_password,
      }).then(() => {
        ElMessage.success(t("tip.passwordChangeSuccess"))
        isShowDialog.value = false
      })
    }
  })
}
</script>
