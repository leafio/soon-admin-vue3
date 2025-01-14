<template>
  <div class="page-container bg flex-1 flex flex-col overflow-auto">
    <div class="btn-bar">
      <BtnAdd @click="handleShowAdd" />
      <BtnRefresh @click="refresh" />
    </div>
    <div class="table-container">
      <el-table
        v-loading="loading"
        :data="list"
        class="h-full"
        row-key="id"
        default-expand-all
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column align="center" type="index" width="50px" />
        <el-table-column v-for="col in cols" :key="col.prop" :prop="col.prop" :label="col.label" :min-width="col['min-width']">
          <template #default="{ row }">
            <template v-if="col.prop == 'meta.title'">
              <MenuTitle :row="row"></MenuTitle>
            </template>
            <template v-if="col.prop == 'menuType'">
              <MenuTag :row="row"></MenuTag>
            </template>
          </template>
        </el-table-column>
        <el-table-column :label="t('action')" align="center" fixed="right">
          <template #default="{ row }">
            <MenuAction :row="row"></MenuAction>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="md:hidden my-2">
      <el-tree class="w-full" :data="list" :props="{ label: 'meta.title', children: 'children' }" default-expand-all>
        <template #default="{ data: row }">
          <div class="flex-1 flex justify-between text-lg py-1">
            <div class="flex">
              <div class="mr-1">
                <MenuTag :row="row"></MenuTag>
              </div>
              <MenuTitle :row="row"></MenuTitle>
              <span v-if="row.children?.length">({{ row.children.length }})</span>
            </div>
            <div>
              <MenuAction :row="row"></MenuAction>
            </div>
          </div>
        </template>
      </el-tree>
    </div>
    <el-pagination
      v-model:current-page="pageInfo.pageIndex"
      v-model:page-size="pageInfo.pageSize"
      class="pagination-container"
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
    <FormDialog ref="refFormDialog" @success="refresh" />
  </div>
</template>
<script setup lang="tsx">
import BtnAdd from "@/components/soon/soon-tool-bar/btn-add.vue"
import BtnRefresh from "@/components/soon/soon-tool-bar/btn-refresh.vue"

import type { Menu } from "@/api"
import { tree_menu, del_menu } from "@/api"

import FormDialog from "./dialog.vue"
import { ElMessageBox } from "element-plus"
import { showMenuTitle } from "@/router/utils"

import { tLocales } from "@/i18n"
import en_system_menu from "@/i18n/locales/en/system/menu"
import zh_system_menu from "@/i18n/locales/zh/system/menu"
import ko_system_menu from "@/i18n/locales/ko/system/menu"
import { usePageList } from "@/biz/list"
const t = tLocales({ zh: zh_system_menu, en: en_system_menu, ko: ko_system_menu })

type Item = Menu

const MenuTitle = ({ row }: { row: Item }) => {
  const title = row.meta?.title ?? ""
  const parsedTitle = showMenuTitle(title)
  return (
    <span>
      {title}
      {parsedTitle !== title && <span class="text-sm text-gray-400">({parsedTitle})</span>}
    </span>
  )
}

const MenuTag = ({ row }: { row: Item }) => {
  return (
    <>
      {row.menuType == "page" && <el-tag effect="plain">{t("menuType.page")}</el-tag>}
      {row.menuType == "link" && (
        <el-tag effect="plain" type="warning">
          {t("menuType.link")}
        </el-tag>
      )}
      {row.menuType == "iframe" && (
        <el-tag effect="plain" type="danger">
          {t("menuType.iframe")}
        </el-tag>
      )}
      {row.menuType == "btn" && (
        <el-tag effect="plain" type="success">
          {t("menuType.button")}
        </el-tag>
      )}
    </>
  )
}
const MenuAction = ({ row }: { row: Item }) => {
  return (
    <>
      <el-button size="small" text type="danger" onClick={() => handleDelete(row)}>
        {t("del")}
      </el-button>
      {row.menuType !== "btn" && (
        <el-button size="small" text type="primary" onClick={() => handleShowAdd(row)}>
          {t("add")}
        </el-button>
      )}
      <el-button size="small" text type="primary" onClick={() => handleShowEdit(row)}>
        {t("edit")}
      </el-button>
    </>
  )
}

const showSearch = ref(true)

const {
  list,
  refresh,
  total,
  loading,
  search,
  reset,
  params: queryForm,
  pageInfo,
} = usePageList({
  searchApi: tree_menu,
  initParams: { hasBtn: true },
})
refresh()

const cols = computed(() => [
  {
    prop: "meta.title",
    label: t("label.menuTitle"),
    "min-width": "200",
    render(item: Item) {
      return item.meta?.title
    },
  },
  {
    prop: "menuType",
    label: t("label.menuType"),
    "min-width": "64",
  },
  {
    prop: "path",
    label: t("label.routePath"),
    "min-width": "120",
  },

  {
    prop: "auth",
    label: t("label.auth"),
    "min-width": "64",
  },
  // {
  //   prop: "sort",
  //   label: t("label.sort"),
  //   width: "",
  // },
  // {
  //   prop: "hidden",
  //   label: t("label.hidden"),
  //   width: "",
  // },
])
const handleDelete = (item: Item) => {
  ElMessageBox.confirm(t("tip.confirmDel", { name: item.name }), t("tip.title"), {
    confirmButtonText: t("del"),
    cancelButtonText: t("cancel"),
    type: "warning",
  })
    .then(async () => {
      await del_menu(item)
      refresh()
      ElMessage({
        type: "success",
        message: t("tip.delSuccess"),
      })
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: t("tip.delCanceled"),
      })
    })
}

const refFormDialog = ref<InstanceType<typeof FormDialog> | null>(null)

const handleShowEdit = (item: Item) => {
  refFormDialog.value?.open("edit", item)
}
const handleShowAdd = (item?: Item) => {
  refFormDialog.value?.open("add", { parentId: item?.id })
}
</script>
<style scoped></style>
