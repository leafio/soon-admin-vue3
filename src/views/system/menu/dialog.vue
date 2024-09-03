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
      <el-form-item :label="t('label.parentMenu')" class="dialog-form-item">
        <el-cascader v-model="cascader_value" :options="deptOptions" :props="{ checkStrictly: true, value: 'id' }" clearable>
          <template #default="{ node, data }">
            <span>{{ data.meta.title }}</span>
            <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
          </template>
        </el-cascader>
      </el-form-item>

      <el-form-item :label="t('label.menuType')" class="dialog-form-item">
        <el-radio-group v-model="formData.menuType">
          <el-radio label="page">{{ t("menuType.page") }}</el-radio>
          <el-radio label="btn">{{ t("menuType.button") }}</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item :label="t('label.menuTitle')" class="dialog-form-item">
        <el-input v-model="formData.meta.title" clearable></el-input>
      </el-form-item>

      <template v-if="formData.menuType === 'page'">
        <el-form-item :label="t('label.routePath')" class="dialog-form-item">
          <el-input v-model="formData.path" clearable></el-input>
        </el-form-item>

        <el-form-item :label="t('label.redirect')" class="dialog-form-item">
          <el-input v-model="formData.redirect" clearable></el-input>
        </el-form-item>

        <el-form-item :label="t('label.menuIcon')" class="dialog-form-item">
          <el-input v-model="formData.meta.icon" clearable></el-input>
        </el-form-item>

        <el-form-item :label="t('label.component')" class="dialog-form-item">
          <el-input v-model="formData.component" clearable></el-input>
        </el-form-item>

        <el-form-item :label="t('label.linkUrl')" class="dialog-form-item">
          <el-input v-model="formData.meta.link" clearable> </el-input>
        </el-form-item>
      </template>

      <el-form-item :label="t('label.auth')" class="dialog-form-item">
        <el-input v-model="formData.auth" clearable></el-input>
      </el-form-item>

      <el-form-item :label="t('label.sort')" class="dialog-form-item">
        <el-input-number v-model="formData.sort" controls-position="right" class="w100" />
      </el-form-item>

      <template v-if="formData.menuType === 'page'">
        <el-form-item :label="t('hidden.title')" class="dialog-form-item">
          <el-radio-group v-model="formData.meta.isHide">
            <el-radio :value="true">{{ t("hidden.true") }}</el-radio>
            <el-radio :value="false">{{ t("hidden.false") }}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item :label="t('pageCache.title')" class="dialog-form-item">
          <el-radio-group v-model="formData.meta.isKeepAlive">
            <el-radio :value="true">{{ t("pageCache.true") }}</el-radio>
            <el-radio :value="false">{{ t("pageCache.false") }}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item :label="t('fixed.title')" class="dialog-form-item">
          <el-radio-group v-model="formData.meta.isAffix">
            <el-radio :value="true">{{ t("fixed.true") }}</el-radio>
            <el-radio :value="false">{{ t("fixed.false") }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </template>
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
import { tree_menu, Menu, add_menu, update_menu } from "@/api"
import { useDialog } from "@/hooks/dialog"
import { tMessages } from "@/i18n"
import { zh_system_menu } from "@/i18n/zh/system/menu"
import { en_system_menu } from "@/i18n/en/system/menu"

const formRef = ref<FormInstance>()
const emit = defineEmits(["success"])
const deptOptions = ref<any[]>([])
const t = tMessages({ "zh-cn": zh_system_menu, en: en_system_menu })
const titles = computed(() => ({
  add: t("add"),
  edit: t("edit"),
  detail: t("detail"),
}))
const { visible, open, close, type, formData } = useDialog<Menu>({
  formRef,
  initFormData: { menuType: "page", meta: {} },
})

const cascader_value = computed({
  get() {
    return formData.value.parentId as any
  },
  set(val: number[]) {
    const last = (val ?? []).slice(-1)[0]
    formData.value.parentId = last ?? null
  },
})
watchEffect(() => {
  if (visible.value) {
    tree_menu({ hasBtn: false }).then((res) => {
      const data: any = res.list
      const parseChildren = (data: { children: any[]; label: any; meta: any }[]) => {
        data.forEach((item) => {
          item.label = item.meta.title
          if (item.children) {
            parseChildren(item.children)
          }
        })
      }
      parseChildren(data)
      deptOptions.value = res.list
    })
  }
})

const submit = () => {
  formRef.value?.validate((valid, fields) => {
    if (!valid) return
    const data = Object.assign({}, formData.value) as Menu
    if (type.value === "add") {
      add_menu(data).then((res) => {
        ElMessage.success(t("tip.addSuccess"))
        emit("success")
        close()
      })
    } else if (type.value === "edit") {
      update_menu(data).then((res) => {
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
const rules = reactive({
  "meta.title": [{ required: true, message: "请输入部门", trigger: "blur" }],
})
defineExpose({ open, close })
</script>

<style scoped lang="scss"></style>
