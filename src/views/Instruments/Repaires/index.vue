<script setup lang="jsx">
import { reactive, ref, unref } from 'vue'
import { getRepairsList } from '@/api'

import { useTable } from '@/hooks/web/useTable'
import { useI18n } from '@/hooks/web/useI18n'
import { Table, } from '@/components/Table'
import { Search } from '@/components/Search'
import { ContentWrap } from '@/components/ContentWrap'
import Write from './components/Write.vue'
import Detail from './components/Detail.vue'
import { Dialog } from '@/components/Dialog'
import { BaseButton } from '@/components/Button'
import { ElTag } from 'element-plus'

const { t } = useI18n()

const searchParams = ref({})

// 维修状态选项
const statusOptions = [
  { label: '全部', value: '' },
  { label: '待处理', value: 0 },
  { label: '维修中', value: 1 },
  { label: '已完成', value: 2 }
]

const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      ...searchParams.value
    }
    // 移除空值参数
    if (params.status === '' || params.status === undefined) {
      delete params.status
    }
    const { list, total } = await getRepairsList(params)
    return {
      list: list || [],
      total: total
    }
  }
})


const renderTag = (enable) => {
  switch (enable) {
    case 0:
      return <ElTag type='danger'>硬件故障</ElTag>
    case 1:
      return <ElTag type='warning'>软件故障</ElTag>
    case 2:
      return <ElTag type='info'>操作错误</ElTag>
    case 3:
      return <ElTag type='info'>其他</ElTag>
    default:
      return <ElTag type='info'>待审核</ElTag>
  }
}

const status = (enable) => {
  switch (enable) {
    case 0:
      return <ElTag type='success'>待处理</ElTag>
    case 1:
      return <ElTag type='danger'>维修中</ElTag>
    case 2:
      return <ElTag type='warning'>已完成</ElTag>
    default:
      return <ElTag type='danger'>待处理</ElTag>
  }
}


const { dataList, loading, total, currentPage, pageSize } = tableState
const { getList } = tableMethods

const tableColumns = reactive([
  {
    field: 'id',
    label: 'ID',
  },
  {
    field: 'repairNumber',
    label: '维修单号',
  },
  {
    field: 'instrument',
    label: '报修设备',
    slots: {
      default: (data) => {
        return (
          <>
            <div>{data.row.instrument?.name}</div>
          </>
        )
      }
    }
  },
  {
    field: 'model',
    label: '设备序列号',
    slots: {
      default: (data) => {
        return (
          <>
            <div>{data.row.instrument?.model}</div>
          </>
        )
      }
    }
  },
  {
    field: 'reporter',
    label: '报修用户',
    slots: {
      default: (data) => {
        return (
          <>
            <div>{data.row.reporter?.username}</div>
          </>
        )
      }
    }
  },
  {
    field: 'faultType',
    label: '故障类型',
    slots: {
      default: (data) => {
        return (
          <>
            <div>{renderTag(data.row.faultType)}</div>
          </>
        )
      }
    }
  },
  {
    field: 'description',
    label: '故障详细描述'
  },
  {
    field: 'createdAt',
    label: '报修时间',
  },
  {
    field: 'status',
    label: '维修状态',
    slots: {
      default: (data) => {
        return (
          <>
            <div>{status(data.row.status)}</div>
          </>
        )
      }
    }
  },
  {
    field: 'action',
    label: t('userDemo.action'),
    width: 240,
    slots: {
      default: (data) => {
        const row = data.row
        return (
          <>
            <BaseButton type="primary" onClick={() => action(row, 'edit')
            }>
              审核
            </BaseButton>
            < BaseButton type="success" onClick={() => action(row, 'detail')
            }>
              {t('exampleDemo.detail')}
            </BaseButton>

          </>
        )
      }
    }
  }
])

const searchSchema = reactive([
  {
    field: 'status',
    label: '维修状态',
    component: 'Select',
    componentProps: {
      options: statusOptions
    }
  }
])


const setSearchParams = (data) => {
  searchParams.value = data
  getList()
}

const dialogVisible = ref(false)
const dialogTitle = ref('')

const currentRow = ref()
const actionType = ref('')

const writeRef = ref()

const saveLoading = ref(false)

const action = (row, type) => {
  dialogTitle.value = t(type === 'edit' ? "审核" : 'exampleDemo.detail')
  actionType.value = type
  currentRow.value = row
  dialogVisible.value = true
}


const save = async () => {
  const write = unref(writeRef)
  const formData = await write?.submit()
  if (formData) {
    saveLoading.value = true
    setTimeout(() => {
      saveLoading.value = false
      dialogVisible.value = false
      getList()
    }, 1000)
  }
}

</script>

<template>
  <ContentWrap>
    <Search :schema="searchSchema" @reset="setSearchParams" @search="setSearchParams" />
    <Table :columns="tableColumns" default-expand-all node-key="id" :data="dataList" :loading="loading" :pagination="{
      total
    }" @register="tableRegister" />
  </ContentWrap>

  <Dialog v-model="dialogVisible" :title="dialogTitle">
    <Write v-if="actionType !== 'detail'" ref="writeRef" :current-row="currentRow" />
    <Detail v-else :current-row="currentRow" />

    <template #footer>
      <BaseButton v-if="actionType !== 'detail'" type="primary" :loading="saveLoading" @click="save">
        {{ t('exampleDemo.save') }}
      </BaseButton>
      <BaseButton @click="dialogVisible = false">{{ t('dialogDemo.close') }}</BaseButton>
    </template>
  </Dialog>
</template>
