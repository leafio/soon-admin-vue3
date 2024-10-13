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
      <el-form-item :label="t('label.menuType')" class="dialog-form-item-full">
        <el-segmented v-model="formData.menuType" :options="menuTypeOptions" size="default" />
      </el-form-item>
      <el-form-item :label="t('label.parentMenu')" class="dialog-form-item">
        <el-cascader v-model="cascader_value" :options="menuTree" :props="{ checkStrictly: true, value: 'id' }" clearable>
          <template #default="{ node, data }">
            <span>{{ data.meta.title }}</span>
            <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
          </template>
        </el-cascader>
      </el-form-item>
      <el-form-item :label="t('label.menuTitle')" class="dialog-form-item">
        <el-input v-model="formData.meta.title" clearable></el-input>
      </el-form-item>
      <el-form-item :label="t('label.auth')" class="dialog-form-item">
        <el-input v-model="formData.auth" clearable></el-input>
      </el-form-item>

      <el-form-item :label="t('label.sort')" class="dialog-form-item">
        <el-input-number v-model="formData.sort" controls-position="right" class="w100" />
      </el-form-item>
      <template v-if="formData.menuType !== 'btn'">
        <el-form-item :label="t('label.menuIcon')" class="dialog-form-item">
          <el-input v-model="formData.meta.icon" clearable></el-input>
        </el-form-item>

        <template v-if="formData.menuType !== 'link'">
          <el-form-item :label="t('label.routePath')" class="dialog-form-item">
            <el-input v-model="formData.path" clearable></el-input>
          </el-form-item>

          <el-form-item :label="t('label.layout')" class="dialog-form-item">
            <el-select v-model="formData.meta.layout" clearable>
              <el-option :value="'layout'">{{ t("layout.default") }}</el-option>
            </el-select>
          </el-form-item>

          <el-form-item :label="t('pageCache.title')" class="dialog-form-item">
            <el-switch v-model="formData.meta.isKeepAlive" />
          </el-form-item>

          <el-form-item :label="t('fixed.title')" class="dialog-form-item">
            <el-switch v-model="formData.meta.isAffix" />
          </el-form-item>
          <el-form-item :label="t('hidden.title')" class="dialog-form-item">
            <el-switch v-model="formData.meta.isHide" />
          </el-form-item>
        </template>
        <el-form-item v-if="formData.menuType === 'page'" :label="t('label.redirect')" class="dialog-form-item">
          <el-input v-model="formData.redirect" clearable></el-input>
        </el-form-item>
        <template v-if="formData.menuType === 'iframe' || formData.menuType === 'link'">
          <el-form-item :label="t('label.linkUrl')" class="dialog-form-item">
            <el-input v-model="formData.meta.link" clearable> </el-input>
          </el-form-item>
        </template>
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
import { tLocales } from "@/i18n"
import zh_system_menu, { Zh_System_Menu } from "@/i18n/zh/system/menu"
import en_system_menu, { En_System_Menu } from "@/i18n/en/system/menu"

const formRef = ref<FormInstance>()
const emit = defineEmits(["success"])
const menuTree = ref<any[]>([])
const t = tLocales<Zh_System_Menu | En_System_Menu>({ zh: zh_system_menu, en: en_system_menu })
const titles = computed(() => ({
  add: t("add"),
  edit: t("edit"),
  detail: t("detail"),
}))
const { visible, open, close, type, formData } = useDialog<Menu>({
  formRef,
  initFormData: { menuType: "page", meta: { cached: true } },
})

const menuTypeOptions = computed(() => [
  {
    label: t("menuType.page"),
    value: "page",
  },
  {
    label: t("menuType.iframe"),
    value: "iframe",
  },
  {
    label: t("menuType.link"),
    value: "link",
  },

  {
    label: t("menuType.button"),
    value: "btn",
  },
])

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
      menuTree.value = res.list
    })
  }
})

const submit = () => {
  formRef.value?.validate((valid, fields) => {
    if (!valid) return
    const data = Object.assign({}, formData.value) as Menu
    data.meta.isIframe = data.menuType === "iframe"
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
  "meta.title": [{ required: true, message: "请输入名称", trigger: "blur" }],
})
defineExpose({ open, close })
</script>

<style scoped lang="scss"></style>
