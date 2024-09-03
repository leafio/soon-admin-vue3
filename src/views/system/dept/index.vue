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
        <el-table-column v-for="col in cols" :key="col.prop" :prop="col.prop" :label="col.label" :width="col.width">
          <template #default="{ row }">
            <template v-if="col.prop == 'createTime'">
              {{ dateFormat(row.createTime) }}
            </template>
          </template>
        </el-table-column>
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
import BtnAdd from "@/components/Toolbar/btn-add.vue"
import BtnRefresh from "@/components/Toolbar/btn-refresh.vue"

import { tree_dept, Dept, del_dept } from "@/api"

import { dateFormat } from "@/utils/tools"
import { usePageList } from "@/hooks/list"

import FormDialog from "./dialog.vue"
import { ElMessageBox } from "element-plus"
import { tMessages } from "@/i18n"
import { zh_system_dept } from "@/i18n/zh/system/dept"
import { en_system_dept } from "@/i18n/en/system/dept"
type Item = Dept

const showSearch = ref(true)

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
  searchApi: tree_dept,
})
refresh()
const t = tMessages({ "zh-cn": zh_system_dept, en: en_system_dept })
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
  {
    prop: "createTime",
    label: t("label.createTime"),
    width: "165px",
    // render(item: Item) {
    //   return dateFormat(item?.createTime)
    // },
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
