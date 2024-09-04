<template>
  <div class="page-container bg flex-1 flex flex-col overflow-auto">
    <el-form v-show="showSearch" size="default" class="query-form" label-position="left">
      <el-form-item :label="t('label.keyword')" class="query-form-item">
        <el-input v-model="queryForm.keyword" clearable :placeholder="t('label.inputKeyword')"></el-input>
      </el-form-item>
      <!-- <el-form-item :label="t('label.createTimeRange')" class="query-form-item-2">
        <el-date-picker
          v-model="queryForm.timeRange"
          :default-time="defaultTime"
          :shortcuts="timePickerOptions.shortcuts"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          :range-separator="t('label.timeTo')"
          :start-placeholder="t('label.startTime')"
          :end-placeholder="t('label.endTime')"
          clearable
        >
        </el-date-picker>
      </el-form-item> -->
      <div class="query-btn-container">
        <el-button type="primary" @click="search">{{ t("search") }}</el-button>
        <el-button @click="reset">{{ t("reset") }}</el-button>
      </div>
    </el-form>
    <div class="btn-bar">
      <BtnAdd @click="handleShowAdd" />
      <BtnExport v-if="auth('user.export')" @click="exportExcel" />
      <BtnCols v-model="cols" @reset="resetCols" />
      <BtnSearch v-model="showSearch" />
      <BtnRefresh @click="refresh" />
    </div>
    <div class="table-container">
      <el-table v-loading="loading" :data="list" class="h-full">
        <el-table-column align="center" type="index" width="50px" />
        <el-table-column v-for="col in checkedCols" :key="col.prop" v-bind="col" align="center">
          <template #default="{ row }">
            <template v-if="col.render">
              <component :is="col.render" :item="row" />
            </template>
          </template>
        </el-table-column>
        <el-table-column :label="t('action')" align="center" fixed="right">
          <template #default="{ row }">
            <el-button v-if="row.username != 'admin'" size="small" text type="danger" @click="handleDelete(row)">{{ t("del") }} </el-button>
            <el-button size="small" text type="primary" @click="handleShowEdit(row)">{{ t("edit") }} </el-button>
            <el-button size="small" text type="primary" @click="handleShowDetail(row)">{{ t("detail") }} </el-button>
            <!-- <el-button size="small" text type="warning" @click="handleShowAdd(row)">重置密码 </el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="md:hidden mt-2">
      <div v-for="(item, index) in list" :key="index" class="mb-2">
        <soon-detail :cols="checkedCols" :item="item">
          <div class="flex-1 flex p-1">
            <el-image class="w-12 mr-1" :src="item.avatar ?? ''"></el-image>
            <div class="flex-1">
              <div class="flex justify-between flex-1">
                <div class="text-lg">
                  <span class="text-xl">{{ item.nickname }}</span>
                  <span class="text-gray-500">({{ item.username }})</span>
                  <el-icon v-if="item.gender" class="ml-0.5">
                    <Female v-if="item.gender === 2" class="text-pink-600" />
                    <Male v-if="item.gender === 1" class="text-blue-600" />
                  </el-icon>

                  <el-tag v-if="item.status" class="ml-0.5" type="success">{{ t("status.enabled") }}</el-tag>
                  <el-tag v-else class="ml-0.5">{{ t("status.disabled") }}</el-tag>
                </div>

                <div class="text-base">
                  <el-button v-if="item.username != 'admin'" size="small" text type="danger" @click.stop="handleDelete(item)">{{ t("del") }} </el-button>
                  <el-button size="small" text type="primary" @click.stop="handleShowEdit(item)">{{ t("edit") }} </el-button>
                </div>
              </div>
              <div class="flex flex-1 justify-between">
                <span>{{ item.name }}</span>
                <span>{{ item.phone }}</span>
                <span>{{ dateFormat(item.createTime) }}</span>
              </div>
            </div>
          </div>
        </soon-detail>
      </div>
    </div>
    <el-pagination
      v-model:current-page="pageInfo.pageIndex"
      v-model:page-size="pageInfo.pageSize"
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
import BtnAdd from "@/components/soon-tool-bar/btn-add.vue"
import BtnExport from "@/components/soon-tool-bar/btn-export.vue"
import BtnRefresh from "@/components/soon-tool-bar/btn-refresh.vue"
import BtnSearch from "@/components/soon-tool-bar/btn-search.vue"
import BtnCols from "@/components/soon-tool-bar/btn-cols.vue"
import SoonDetail from "@/components/soon-detail/index.vue"
import { Female, Male } from "@element-plus/icons-vue"
import { list_user, download_user_table, del_user, UserInfo } from "@/api"

import { defaultTime, dateFormat, timePickerOptions, curMonth } from "@/utils/tools"
import { usePageList } from "@/hooks/list"
import { useAuth } from "@/hooks/auth"

import FormDialog from "./dialog.vue"
import { ElMessageBox } from "element-plus"
import { tMessages } from "@/i18n"
import { zh_system_user } from "@/i18n/zh/system/user"
import { en_system_user } from "@/i18n/en/system/user"
import { useCols } from "@/hooks/cols"
import { useAppStore } from "@/store/modules/app"
type Item = UserInfo
const paginationSize = computed(() => (useAppStore().responsive === "mobile" ? "small" : ""))

const showSearch = ref(true)
const auth = useAuth()

const t = tMessages({
  "zh-cn": zh_system_user,
  en: en_system_user,
})

const {
  list,
  refresh,
  total,
  loading,
  exportExcel,
  search,
  reset,
  params: queryForm,
  pageInfo,
} = usePageList({
  searchApi: list_user,
  excelApi: download_user_table,
  // initParams: { timeRange: curMonth() },
  autoSearchDelay: 300,
})
refresh()

const {
  cols,
  checkedCols,
  reset: resetCols,
} = useCols(() => [
  {
    prop: "username",
    label: t("label.username"),
    width: "",
  },
  {
    prop: "nickname",
    label: t("label.nickname"),
    width: "",
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
    width: "",
  },
  {
    prop: "phone",
    label: t("label.phone"),
    width: "",
  },
  {
    prop: "dept.name",
    label: t("label.deptName"),
    width: "",
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
    width: "",
    render({ item }) {
      return dateFormat(item?.createTime)
    },
  },
])

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
const handleShowAdd = (item: Item) => {
  refFormDialog.value?.open("add")
}
const handleShowDetail = (item: Item) => {
  refFormDialog.value?.open("detail", item)
}
</script>
<style scoped></style>
