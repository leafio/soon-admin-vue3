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
        <el-table-column v-for="col in cols" :key="col.prop" :prop="col.prop" :label="col.label" :width="col.width">
          <template #default="{ row }">
            <template v-if="col.prop == 'menuType'">
              <el-tag v-if="row.menuType == 'page'" effect="plain">{{ t("menuType.page") }}</el-tag>
              <el-tag v-else-if="row.menuType == 'link'" effect="plain" type="warning">{{ t("menuType.link") }}</el-tag>
              <el-tag v-else-if="row.menuType == 'iframe'" effect="plain" type="danger">{{ t("menuType.iframe") }}</el-tag>
              <el-tag v-else-if="row.menuType == 'btn'" effect="plain" type="success">{{ t("menuType.button") }}</el-tag>
            </template>
          </template>
        </el-table-column>
        <el-table-column :label="t('action')" align="center" fixed="right">
          <template #default="{ row }">
            <el-button size="small" text type="danger" @click="handleDelete(row)">{{ t("del") }}</el-button>
            <el-button v-if="row.menuType !== 'btn'" size="small" text type="primary" @click="handleShowAdd(row)">{{ t("add") }} </el-button>
            <el-button size="small" text type="primary" @click="handleShowEdit(row)">{{ t("edit") }} </el-button>
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
                <el-tag v-if="row.menuType == 'page'" size="small" effect="plain">{{ t("menuType.page") }}</el-tag>
                <el-tag v-else-if="row.menuType == 'link'" size="small" effect="plain" type="warning">{{ t("menuType.link") }}</el-tag>
                <el-tag v-else-if="row.menuType == 'iframe'" size="small" effect="plain" type="danger">{{ t("menuType.iframe") }}</el-tag>
                <el-tag v-else-if="row.menuType == 'btn'" size="small" effect="plain" type="success">{{ t("menuType.button") }}</el-tag>
              </div>
              <span>
                {{ row.name ?? row.meta.title }}
              </span>
              <span v-if="row.children?.length">({{ row.children.length }})</span>
            </div>
            <div>
              <el-button size="small" text type="danger" @click="handleDelete(row)">{{ t("del") }}</el-button>
              <el-button v-if="row.menuType !== 'btn'" size="small" text type="primary" @click="handleShowAdd(row)">{{ t("add") }} </el-button>
              <el-button size="small" text type="primary" @click="handleShowEdit(row)">{{ t("edit") }} </el-button>
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
<script setup lang="ts">
import BtnAdd from "@/components/soon-tool-bar/btn-add.vue"
import BtnRefresh from "@/components/soon-tool-bar/btn-refresh.vue"
import BtnSearch from "@/components/soon-tool-bar/btn-search.vue"

import { tree_menu, Menu, del_menu } from "@/api"

import { dateFormat } from "@/utils/tools"
import { usePageList } from "@/hooks/list"

import FormDialog from "./dialog.vue"
import { ElMessageBox } from "element-plus"
import { tLocales } from "@/i18n"
import en_system_menu, { En_System_Menu } from "@/i18n/en/system/menu"
import zh_system_menu, { Zh_System_Menu } from "@/i18n/zh/system/menu"

type Item = Menu

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
const t = tLocales<Zh_System_Menu | En_System_Menu>({ zh: zh_system_menu, en: en_system_menu })
const cols = computed(() => [
  {
    prop: "meta.title",
    label: t("label.menuTitle"),
    width: "",
  },
  {
    prop: "menuType",
    label: t("label.menuType"),
    width: "",
  },
  {
    prop: "path",
    label: t("label.routePath"),
    width: "",
  },

  {
    prop: "auth",
    label: t("label.auth"),
    width: "",
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
