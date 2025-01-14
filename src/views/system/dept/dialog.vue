<template>
  <el-dialog v-model="visible" :title="titles[type]" draggable>
    <el-form
      :key="'' + visible"
      ref="formRef"
      :model="formData"
      :rules="rules"
      :disabled="type === 'detail'"
      size="default"
      label-width="12em"
      class="dialog-form"
    >
      <el-form-item :label="t('label.superiorDepartment')" prop="parentId" class="dialog-form-item-full">
        <el-cascader
          v-model="formData.parentId"
          :options="deptOptions"
          :props="{ checkStrictly: true, value: 'id', label: 'name' }"
          :placeholder="t('label.selectSuperior')"
          clearable
          class="w-full"
        >
          <template #default="{ node, data }">
            <span>{{ data.name }}</span>
            <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
          </template>
        </el-cascader>
      </el-form-item>
      <el-form-item :label="t('label.name')" prop="name" class="dialog-form-item-full">
        <el-input v-model="formData.name" clearable></el-input>
      </el-form-item>

      <el-form-item :label="t('label.remark')" prop="desc" class="dialog-form-item-full">
        <el-input v-model="formData.desc" clearable type="textarea" :rows="2"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button size="default" @click="onCancel">{{ t("cancel") }}</el-button>
        <el-button type="primary" size="default" @click="submit">{{ t("confirm") }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import type { FormInstance } from "element-plus"
import type { Dept } from "@/api"
import { tree_dept, add_dept, update_dept } from "@/api"

import { tLocales } from "@/i18n"
import en_system_dept from "@/i18n/locales/en/system/dept"
import zh_system_dept from "@/i18n/locales/zh/system/dept"
import ko_system_dept from "@/i18n/locales/ko/system/dept"
import { useDialog } from "@/biz/dialog"

const formRef = ref<FormInstance>()
const emit = defineEmits(["success"])
const t = tLocales({ zh: zh_system_dept, en: en_system_dept, ko: ko_system_dept })
const deptOptions = ref<any[]>([])
const titles = computed(() => ({
  add: t("add"),
  edit: t("edit"),
  detail: t("detail"),
}))
const { visible, open, close, type, formData } = useDialog<Dept>({ formRef })

const submit = () => {
  formRef.value?.validate((valid, fields) => {
    if (!valid) return
    const data = Object.assign({}, formData.value) as Dept
    if (type.value === "add") {
      add_dept(data).then((res) => {
        ElMessage.success(t("tip.addSuccess"))
        emit("success")
        close()
      })
    } else if (type.value === "edit") {
      update_dept(data).then((res) => {
        ElMessage.success(t("tip.modifySuccess"))
        emit("success")
        close()
      })
    }
  })
}

watchEffect(() => {
  if (visible.value) {
    tree_dept().then((res) => {
      deptOptions.value = res.list
    })
  }
})

// 取消
const onCancel = () => {
  close()
}
const rules = computed(() => ({
  name: [{ required: true, message: t("label.inputName"), trigger: "blur" }],
}))
defineExpose({ open, close })
</script>

<style scoped lang="scss"></style>
