<template>
  <el-dialog v-model="visible" :title="titles[type]" draggable>
    <el-form
      :key="'' + visible"
      ref="formRef"
      :model="formData"
      :rules="rules"
      :disabled="type === 'detail'"
      size="default"
      label-width="7em"
      class="dialog-form"
    >
      <el-form-item :label="t('label.name')" prop="name" class="dialog-form-item">
        <el-input v-model="formData.name" clearable></el-input>
      </el-form-item>
      <!-- <el-form-item :label="t('label.code')" prop="code" class="dialog-form-item">
        <el-input v-model="formData.code" placeholder="" clearable></el-input>
      </el-form-item> -->

      <el-form-item :label="t('label.status')" prop="status" class="dialog-form-item">
        <el-switch
          v-model="formData.status"
          :disabled="formData.id === 'admin'"
          inline-prompt
          :active-value="1"
          :inactive-value="0"
          :active-text="t('status.enabled')"
          :inactive-text="t('status.disabled')"
        />
      </el-form-item>
      <el-form-item :label="t('label.remark')" prop="desc" class="dialog-form-item">
        <el-input v-model="formData.desc" clearable type="textarea" :rows="2"></el-input>
      </el-form-item>
      <el-form-item :label="t('label.permissions')" prop="permissions" class="dialog-form-item-full">
        <el-cascader-panel
          v-model="formData.permissions"
          :disabled="formData.id === 'admin'"
          class="w-full"
          :options="menuOptions"
          :props="{
            value: 'id',
            emitPath: false,
            checkStrictly: true,
            multiple: true,
          }"
          clearable
          filterable
          :placeholder="t('label.selectPermissions')"
        >
          <template #default="{ node, data }">
            <span>{{ data.meta.title }}</span>
            <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
          </template>
        </el-cascader-panel>
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
import { FormInstance } from "element-plus"
import { add_role, update_role, Role, tree_menu, Menu } from "@/api"
import { useDialog } from "@/hooks/dialog"
import { tLocales } from "@/i18n"
import zh_system_role, { Zh_System_Role } from "@/i18n/zh/system/role"
import en_system_role, { En_System_Role } from "@/i18n/en/system/role"
const emit = defineEmits(["success"])
const formRef = ref<FormInstance>()
const t = tLocales<Zh_System_Role | En_System_Role>({ zh: zh_system_role, en: en_system_role })
const titles = computed(() => ({
  add: t("add"),
  edit: t("edit"),
  detail: t("detail"),
}))

const initFormData = {
  status: 1,
}
const { visible, open, close, type, formData } = useDialog<Role>({ formRef, initFormData })

const menuOptions = ref<Menu[]>([])
watchEffect(() => {
  if (visible.value) {
    tree_menu({ hasBtn: true }).then((res) => {
      const data = res.list
      const parseChildren = (data: { children: any[]; label: any; meta: any }[]) => {
        data.forEach((item) => {
          item.label = item.meta.title
          if (item.children) {
            parseChildren(item.children)
          }
        })
      }
      parseChildren(data as any)
      menuOptions.value = data
    })
  }
})
const submit = () => {
  formRef.value?.validate((valid, fields) => {
    if (!valid) return
    const data = Object.assign({}, formData.value) as Role
    if (type.value === "add") {
      add_role(data).then((res) => {
        ElMessage.success(t("tip.addSuccess"))
        emit("success")
        close()
      })
    } else if (type.value === "edit") {
      update_role(data).then((res) => {
        ElMessage.success(t("tip.modifySuccess"))
        emit("success")
        close()
      })
    }
  })
}

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
