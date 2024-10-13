<template>
  <el-dialog v-model="visible" :title="titles[type]" draggable>
    <el-form ref="formRef" :model="formData" :rules="rules" :disabled="type === 'detail'" size="default" label-width="7em" class="dialog-form">
      <el-form-item :label="t('label.username')" prop="username" class="dialog-form-item">
        <el-input v-model="formData.username" clearable :disabled="type === 'edit'" />
      </el-form-item>
      <el-form-item :label="t('label.password')" prop="password" class="dialog-form-item">
        <el-input v-model="formData.password" clearable></el-input>
      </el-form-item>
      <el-form-item :label="t('label.nickname')" prop="nickname" class="dialog-form-item">
        <el-input v-model="formData.nickname" clearable></el-input>
      </el-form-item>
      <el-form-item :label="t('label.name')" prop="name" class="dialog-form-item">
        <el-input v-model="formData.name" clearable></el-input>
      </el-form-item>
      <el-form-item :label="t('label.phone')" prop="phone" class="dialog-form-item">
        <el-input v-model="formData.phone" placeholder="" clearable></el-input>
      </el-form-item>
      <el-form-item :label="t('label.email')" prop="email" class="dialog-form-item">
        <el-input v-model="formData.email" placeholder="" clearable></el-input>
      </el-form-item>

      <el-form-item :label="t('label.gender')" prop="gender" class="dialog-form-item">
        <el-select v-model="formData.gender" placeholder="" clearable>
          <el-option v-for="item in genderOptions" :key="item.value" :value="item.value" :label="item.label" />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('label.status')" prop="status" class="dialog-form-item">
        <el-switch
          v-model="formData.status"
          :disabled="formData.username === 'admin'"
          inline-prompt
          :active-value="1"
          :inactive-value="0"
          :active-text="t('status.enabled')"
          :inactive-text="t('status.disabled')"
        />
      </el-form-item>

      <el-form-item :label="t('label.roleName')" class="dialog-form-item">
        <el-select v-model="formData.roleId" :disabled="formData.username === 'admin'" placeholder="" clearable>
          <el-option v-for="item in roleOptions" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('label.deptName')" prop="deptId" class="dialog-form-item">
        <el-cascader
          v-model="formData.deptId"
          class="w-full"
          :options="deptOptions"
          :props="{
            value: 'id',
            label: 'name',
            emitPath: false,
            checkStrictly: true,
          }"
          clearable
          filterable
          :placeholder="t('label.selectDept')"
        >
          <template #default="{ node, data }">
            <span>{{ data.name }}</span>
            <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
          </template>
        </el-cascader>
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
import { FormInstance } from "element-plus"
import { list_role, add_user, update_user, Role, tree_dept, Dept, User } from "@/api"
import { useDialog } from "@/hooks/dialog"
import { tLocales } from "@/i18n"
import { Zh_System_User } from "@/i18n/zh/system/user"
import { En_System_User } from "@/i18n/en/system/user"

type Item = User
const formRef = ref<FormInstance>()
const emit = defineEmits(["success"])
const t = tLocales<Zh_System_User | En_System_User>({
  zh: () => import("@/i18n/zh/system/user"),
  en: () => import("@/i18n/en/system/user"),
})

const titles = computed(() => ({
  add: t("add"),
  edit: t("edit"),
  detail: t("detail"),
}))
const initFormData = {
  status: 1,
}

const { visible, open, close, type, formData } = useDialog<Item>({ formRef, initFormData })

const roleOptions = ref<Role[]>([])
const deptOptions = ref<Dept[]>([])
const genderOptions = computed(() => [
  {
    label: t("gender.man"),
    value: 1,
  },
  {
    label: t("gender.woman"),
    value: 2,
  },
  {
    label: t("gender.unknown"),
    value: 0,
  },
])
watch(
  () => visible.value,
  () => {
    if (visible.value) {
      formRef.value?.resetFields()
      list_role().then((res) => {
        roleOptions.value = res.list
      })
      tree_dept().then((res) => {
        deptOptions.value = res.list
      })
    }
  },
)

const submit = () => {
  formRef.value?.validate((valid, fields) => {
    if (!valid) return
    const data = Object.assign({}, formData.value) as Item
    if (type.value === "add") {
      add_user(data).then((res) => {
        ElMessage.success(t("tip.addSuccess"))
        emit("success")
        close()
      })
    } else if (type.value === "edit") {
      update_user({ id: data.id }, data).then((res) => {
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
  username: [{ required: true, message: t("label.inputUsername"), trigger: "blur" }],
  // nickname: [{ required: true, message: "请输入名字", trigger: "blur" }],
  // phone: [
  //   {
  //     required: true,
  //     validator: (rule: any, value: any, callback: any) => {
  //       if (!value || !verifyPhone(value)) {
  //         callback(new Error("电话号码格式不正确"))
  //       }
  //       callback()
  //     },
  //     trigger: "blur",
  //   },
  // ],
}))

defineExpose({ open, close })
</script>

<style scoped lang="scss"></style>
