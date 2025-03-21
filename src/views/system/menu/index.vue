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
        <el-table-column v-for="col in cols" :key="col.prop" :prop="col.prop" :label="col.label" :min-width="col.minWidth">
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
      v-model:current-page="queryForm.pageIndex"
      v-model:page-size="queryForm.pageSize"
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
import { BtnAdd, SoonDetail, BtnCols, BtnSearch, BtnExport, BtnRefresh } from "@/components/soon"

import type { Menu } from "@/api"
import { tree_menu, del_menu } from "@/api"

import FormDialog from "./dialog.vue"

import { showMenuTitle } from "@/router/utils"

import { tLocales } from "@/i18n"
import en_system_menu from "@/i18n/locales/en/system/menu"
import zh_system_menu from "@/i18n/locales/zh/system/menu"
import ko_system_menu from "@/i18n/locales/ko/system/menu"
import type { ElTableCol } from "@/biz"
import { usePagedList } from "@/biz"
const t = tLocales({ zh: zh_system_menu, en: en_system_menu, ko: ko_system_menu })

type Item = Menu
type Col = ElTableCol<Item, "action">

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
  query: queryForm,
} = usePagedList({
  searchApi: tree_menu,
  initQuery: { hasBtn: true },
})
refresh()

const cols = computed<Col[]>(() => [
  {
    prop: "meta.title",
    label: t("label.menuTitle"),
    minWidth: "200",
    render({ item }: { item: Item }) {
      return item.meta?.title
    },
  },
  {
    prop: "menuType",
    label: t("label.menuType"),
    minWidth: "64",
  },
  {
    prop: "path",
    label: t("label.routePath"),
    minWidth: "120",
  },

  {
    prop: "auth",
    label: t("label.auth"),
    minWidth: "64",
  },
  // {
  //   prop: "sort",
  //   label: t("label.sort"),
  //
  // },
  // {
  //   prop: "hidden",
  //   label: t("label.hidden"),
  //
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
