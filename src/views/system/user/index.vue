<template>
  <div class="page-container bg flex-1 flex flex-col overflow-auto">
    <el-form v-show="showSearch" size="default" class="query-form" label-position="left">
      <el-form-item :label="t('label.keyword')" class="query-form-item">
        <el-input v-model="queryForm.keyword" clearable :placeholder="t('label.inputKeyword')"></el-input>
      </el-form-item>
      <el-form-item :label="t('label.createTimeRange')" class="query-form-item-2">
        <el-date-picker
          v-model="queryForm.timeRange"
          :default-time="defaultTime"
          :shortcuts="timePickerOptions.shortcuts"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          :start-placeholder="t('label.startTime')"
          :end-placeholder="t('label.endTime')"
          clearable
        >
        </el-date-picker>
      </el-form-item>
      <div class="query-btn-container">
        <el-button type="primary" @click="refresh(true)">{{ t("search") }}</el-button>
        <el-button @click="reset">{{ t("reset") }}</el-button>
      </div>
    </el-form>
    <div class="btn-bar">
      <BtnAdd @click="handleShowAdd" />
      <BtnExport v-if="auth('user.export')" @click="download_user_table(queryForm)" />
      <BtnCols v-model="cols" @reset="resetCols" />
      <BtnSearch v-model="showSearch" />
      <BtnRefresh @click="refresh" />
    </div>
    <div class="table-container">
      <el-table v-loading="loading" :data="list" class="h-full">
        <el-table-column align="center" type="index" width="50px" />
        <el-table-column v-for="col in [...checkedCols, actionCol]" :key="col.prop" v-bind="col" align="center">
          <template #default="{ row }">
            <template v-if="col.render">
              <component :is="col.render" :item="row" />
            </template>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="md:hidden mt-2">
      <div v-for="(item, index) in list" :key="index" class="mb-2 bg-white dark:bg-neutral-900">
        <soon-detail :cols="checkedCols" :item="item">
          <div class="flex-1 flex p-1 border-b border-solid border-neutral-200 dark:border-neutral-800 items-center">
            <el-avatar class="mr-1" :src="item.avatar ?? ''"> {{ item.username }} </el-avatar>
            <div class="flex-1">
              <div class="flex justify-between">
                <div class="text-lg">
                  <span class="text-xl">{{ item.nickname }}</span>
                  <span class="text-gray-500">({{ item.username }})</span>
                  <el-icon v-if="item.gender" class="ml-0.5">
                    <Female v-if="item.gender === 2" class="text-pink-600" />
                    <Male v-if="item.gender === 1" class="text-blue-600" />
                  </el-icon>
                  <el-tag v-if="item.status" size="small" class="ml-0.5" type="success">{{ t("status.enabled") }}</el-tag>
                  <el-tag v-else size="small" class="ml-0.5">{{ t("status.disabled") }}</el-tag>
                </div>
              </div>
              <div class="flex justify-between text-gray-600">
                <div>{{ item.phone }}</div>
                <span>{{ formatDateTime(item.createTime) }}</span>
              </div>
            </div>
          </div>
          <div class="flex justify-between items-center">
            <component :is="actionCol.render" :item="item" />
            <soon-detail-toggle class="m-1"></soon-detail-toggle>
          </div>
        </soon-detail>
      </div>
    </div>
    <el-pagination
      v-model:current-page="pager.pageIndex"
      v-model:page-size="pager.pageSize"
      @current-change="refresh()"
      @size-change="refresh(true)"
      class="pagination-container"
      :background="paginationSize !== 'small'"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      :size="paginationSize"
    >
    </el-pagination>

    <FormDialog ref="refFormDialog" @success="refresh" />
  </div>
</template>
<script setup lang="tsx">
import { BtnAdd, SoonDetail, SoonDetailToggle, BtnCols, BtnSearch, BtnExport, BtnRefresh } from "@/components/soon"
import { Female, Male } from "@element-plus/icons-vue"
import type { UserInfo } from "@/api"
import { list_user, download_user_table, del_user } from "@/api"
import type { ElTableCol } from "@/biz"
import { formatDateTime, useCols, defaultTime, timePickerOptions, usePagedList } from "@/biz"

import { useMobile } from "@/biz/app/responsive"
import { auth } from "@/biz/app/auth"
import FormDialog from "./dialog.vue"

import { tLocales } from "@/i18n"

import { watchDebounced } from "@vueuse/core"
const t = tLocales({
  zh: () => import("@/i18n/locales/zh/system/user"),
  en: () => import("@/i18n/locales/en/system/user"),
  ko: () => import("@/i18n/locales/ko/system/user"),
})

type Item = UserInfo
type Col = ElTableCol<Item, "action">

const { paginationSize } = useMobile()
const showSearch = ref(true)

const { list, refresh, total, loading, search, reset, pager, query: queryForm } = usePagedList(list_user)
refresh()
watchDebounced(queryForm, () => refresh(true), { deep: true, debounce: 500 })

const {
  cols,
  checkedCols,
  reset: resetCols,
} = useCols<Col>(() => [
  {
    prop: "username",
    label: t("label.username"),
  },
  {
    prop: "nickname",
    label: t("label.nickname"),
  },
  {
    prop: "gender",
    label: t("label.gender"),
    width: "100",
    render: ({ item }: { item: Item }) =>
      item?.gender == 1 ? (
        <el-tag>{t("gender.man")}</el-tag>
      ) : item?.gender === 2 ? (
        <el-tag type="danger">{t("gender.woman")}</el-tag>
      ) : (
        <el-tag type="info">{t("gender.unknown")}</el-tag>
      ),
  },
  {
    prop: "role.name",
    label: t("label.roleName"),
  },
  {
    prop: "phone",
    label: t("label.phone"),
  },
  {
    prop: "dept.name",
    label: t("label.deptName"),
  },
  {
    prop: "status",
    label: t("label.status"),
    width: "100",
    render: ({ item }: { item: Item }) => (item?.status == 1 ? <el-tag type="success">{t("status.enabled")}</el-tag> : <el-tag>{t("status.disabled")}</el-tag>),
  },

  {
    prop: "createTime",
    label: t("label.createTime"),
    render({ item }) {
      return formatDateTime(item?.createTime)
    },
  },
])
const actionCol = computed<Col>(() => ({
  prop: "action",
  label: t("action"),
  fixed: "right",
  render({ item }: { item: Item }) {
    return (
      <div>
        {item.username != "admin" && (
          <el-button size="small" text type="danger" onClick={() => handleDelete(item)}>
            {t("del")}
          </el-button>
        )}
        <el-button size="small" text type="primary" onClick={() => handleShowEdit(item)}>
          {t("edit")}
        </el-button>
        <el-button size="small" text type="primary" onClick={() => handleShowDetail(item)}>
          {t("detail")}
        </el-button>
      </div>
    )
  },
}))

const handleDelete = (item: Item) => {
  ElMessageBox.confirm(t("tip.confirmDel", { name: item.name ?? item.username }), t("tip.title"), {
    confirmButtonText: t("del"),
    cancelButtonText: t("cancel"),
    type: "warning",
  })
    .then(async () => {
      await del_user(item)
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
const handleShowAdd = () => {
  refFormDialog.value?.open("add")
}
const handleShowDetail = (item: Item) => {
  refFormDialog.value?.open("detail", item)
}
</script>
<style scoped></style>
