<template>
  <div class="page-container bg">
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
        <el-table-column v-for="col in cols" :key="col.prop" :prop="col.prop" :label="col.label" :width="col.width"> </el-table-column>
        <el-table-column :label="t('action')" align="center" fixed="right" width="200px">
          <template #default="{ row }">
            <el-button size="small" text type="danger" @click="handleDelete(row)">{{ t("del") }}</el-button>
            <el-button size="small" text type="primary" @click="handleShowAdd({ parentId: row.id })">{{ t("add") }} </el-button>
            <el-button size="small" text type="primary" @click="handleShowEdit(row)">{{ t("edit") }} </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="md:hidden my-2">
      <el-tree class="w-full" :data="list" :props="{ label: 'name', children: 'children' }" default-expand-all>
        <template #default="{ data: row }">
          <div class="flex-1 flex justify-between text-lg">
            <div>
              <span>
                {{ row.name }}
              </span>
              <span v-if="row.children?.length">({{ row.children.length }})</span>
            </div>
            <div>
              <el-button size="small" text type="danger" @click="handleDelete(row)">{{ t("del") }}</el-button>
              <el-button size="small" text type="primary" @click="handleShowAdd({ parentId: row.id })">{{ t("add") }} </el-button>
              <el-button size="small" text type="primary" @click="handleShowEdit(row)">{{ t("edit") }} </el-button>
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
<script setup lang="ts">
import { BtnAdd, SoonDetail, BtnCols, BtnSearch, BtnExport, BtnRefresh } from "@/components/soon"

import type { Dept } from "@/api"
import { tree_dept, del_dept } from "@/api"

import FormDialog from "./dialog.vue"
import { ElMessageBox } from "element-plus"
import { tLocales } from "@/i18n"
import en_system_dept from "@/i18n/locales/en/system/dept"
import zh_system_dept from "@/i18n/locales/zh/system/dept"
import ko_system_dept from "@/i18n/locales/ko/system/dept"
import { usePageList } from "@/biz"

type Item = Dept

const showSearch = ref(true)

const {
  list,
  refresh,
  total,
  loading,
  search,
  reset,
  query: queryForm,
} = usePageList({
  searchApi: tree_dept,
})
refresh()
const t = tLocales({ zh: zh_system_dept, en: en_system_dept, ko: ko_system_dept })
const cols = computed(() => [
  {
    prop: "name",
    label: t("label.name"),
    width: "",
  },
  {
    prop: "desc",
    label: t("label.remark"),
    width: "",
  },
])
const handleDelete = (item: Item) => {
  ElMessageBox.confirm(t("tip.confirmDel", { name: item.name }), t("tip.title"), {
    confirmButtonText: t("del"),
    cancelButtonText: t("cancel"),
    type: "warning",
  })
    .then(async () => {
      await del_dept(item)
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
const handleShowAdd = (item?: Partial<Item>) => {
  refFormDialog.value?.open("add", item)
}
</script>
<style scoped></style>
