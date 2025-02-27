<template>
  <div class="page-container bg">
    <el-form v-show="showSearch" size="default" class="query-form" label-position="left">
      <el-form-item :label="t('label.keyword')" class="query-form-item">
        <el-input v-model="queryForm.keyword" clearable :placeholder="t('label.inputKeyword')"></el-input>
      </el-form-item>

      <div class="query-btn-container">
        <el-button type="primary" @click="search">{{ t("search") }}</el-button>
        <el-button @click="reset">{{ t("reset") }}</el-button>
      </div>
    </el-form>

    <div class="btn-bar">
      <BtnAdd @click="handleShowAdd" />
      <BtnSearch v-model="showSearch" />
      <BtnRefresh @click="refresh" />
    </div>
    <div class="table-container">
      <el-table v-loading="loading" :data="list" class="h-full">
        <el-table-column align="center" type="index" width="50px" />
        <el-table-column v-for="col in cols" :key="col.prop" v-bind="col" align="center">
          <template #default="{ row }">
            <template v-if="col.render">
              <component :is="col.render" :item="row" />
            </template>
            <template v-else-if="col.prop == 'createTime'">
              {{ formatDateTime(row.createTime) }}
            </template>
          </template>
        </el-table-column>
        <el-table-column :label="t('action')" align="center" fixed="right">
          <template #default="{ row }">
            <el-button v-if="row.id !== 'admin'" size="small" text type="danger" @click="handleDelete(row)">{{ t("del") }} </el-button>
            <el-button size="small" text type="primary" @click="handleShowEdit(row)">{{ t("edit") }} </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="md:hidden mt-2">
      <div v-for="(item, index) in list" :key="index" class="mb-2 rounded-sm p-1 pb-0 bg-white dark:bg-neutral-900">
        <soon-detail :cols="cols" :item="item">
          <div class="flex justify-between w-full">
            <div class="flex">
              <div>{{ item.name }}</div>
              <div class="ml-4">
                <el-tag v-if="item.status == 1" size="small" type="success">{{ t("status.enabled") }}</el-tag>
                <el-tag v-else size="small">{{ t("status.disabled") }}</el-tag>
              </div>
            </div>
          </div>
          <div class="flex justify-between items-center">
            <div class="pr-6">
              <el-button v-if="item.id !== 'admin'" text class="!border-none" size="small" plain type="danger" @click="handleDelete(item)"
                >{{ t("del") }}
              </el-button>
              <el-button text class="!border-none" size="small" plain type="primary" @click="handleShowEdit(item)">{{ t("edit") }} </el-button>
            </div>
            <soon-detail-toggle class="m-1"></soon-detail-toggle>
          </div>
        </soon-detail>
      </div>
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
import { BtnAdd, SoonDetail, SoonDetailToggle, BtnCols, BtnSearch, BtnExport, BtnRefresh } from "@/components/soon"
import type { Role } from "@/api"
import { list_role, del_role } from "@/api"
import type { ElTableCol } from "@/biz"
import { formatDateTime, usePagedList } from "@/biz"
import FormDialog from "./dialog.vue"

import { tLocales } from "@/i18n"

type Item = Role
type Col = ElTableCol<Item, "action">

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
  searchApi: list_role,
})
refresh()
const t = tLocales({
  zh: () => import("@/i18n/locales/zh/system/role"),
  en: () => import("@/i18n/locales/en/system/role"),
  ko: () => import("@/i18n/locales/ko/system/role"),
})
const cols = computed<Col[]>(() => [
  {
    prop: "name",
    label: t("label.name"),
  },
  // {
  //   prop: "code",
  //   label: t("label.code"),
  //
  // },
  {
    prop: "status",
    label: t("label.status"),

    render: ({ item }: { item?: Item }) =>
      item?.status == 1 ? <el-tag type="success">{t("status.enabled")}</el-tag> : <el-tag>{t("status.disabled")}</el-tag>,
  },
])
const handleDelete = (item: Item) => {
  ElMessageBox.confirm(t("tip.confirmDel", { name: item.name }), t("tip.title"), {
    confirmButtonText: t("del"),
    cancelButtonText: t("cancel"),
    type: "warning",
  })
    .then(async () => {
      await del_role(item)
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
const handleShowAdd = (item: Item) => {
  refFormDialog.value?.open("add")
}
</script>
<style scoped></style>
