<script setup lang="jsx">
import { reactive, ref, unref } from 'vue'

import { useTable } from '@/hooks/web/useTable'
import { useI18n } from '@/hooks/web/useI18n'
import { Table, } from '@/components/Table'
import { ElMessage, ElMessageBox, ElTag } from 'element-plus'
import { Search } from '@/components/Search'
import { ContentWrap } from '@/components/ContentWrap'
import Write from './components/Write.vue'
import Detail from './components/Detail.vue'
import { Dialog } from '@/components/Dialog'
import { BaseButton } from '@/components/Button'

import { getNotifications, deleteNotifications } from '@/api'

const { t } = useI18n()

const searchParams = ref({})

const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      ...searchParams.value
    }
    // 移除空值参数
    if (!params.keyword) {
      delete params.keyword
    }
    const { list, total } = await getNotifications(params)
    return {
      list: list || [],
      total: total
    }
  }
})


const renderTag = (enable) => {
  switch (enable) {
    case 0:
      return <ElTag type='success'>预约审核</ElTag>
    case 1:
      return <ElTag type='warning'>临时通知</ElTag>
    case 2:
      return <ElTag type='info'>预约提醒</ElTag>
    case 3:
      return <ElTag type='primary'>设备申请</ElTag>
    case 4:
      return <ElTag type='danger'>维修进度</ElTag>
    default:
      return <ElTag type='danger'>预约审核</ElTag>
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
    field: 'title',
    label: '通知标题'
  },
  {
    field: 'content',
    label: '通知内容'
  },
  {
    field: 'type',
    label: '通知类型',
    slots: {
      default: (data) => {
        return renderTag(data.row.type)
      }
    }
  },
  {
    field: 'user',
    label: '通知用户',
    slots: {
      default: (data) => {
        return (
          <div>{data.row.user.username}</div>
        )
      }
    }
  },
  {
    field: 'updatedAt',
    label: '通知时间'
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
            < BaseButton type="success" onClick={() => action(row, 'detail')
            }>
              {t('exampleDemo.detail')}
            </BaseButton>
            < BaseButton type="danger" onClick={() => delData(row)}
            >{t('exampleDemo.del')} </BaseButton >
          </>
        )
      }
    }
  }
])

const searchSchema = reactive([
  {
    field: 'keyword',
    label: '关键字',
    component: 'Input',
    componentProps: {
      placeholder: '标题/内容'
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
  dialogTitle.value = t(type === 'edit' ? 'exampleDemo.edit' : 'exampleDemo.detail')
  actionType.value = type
  currentRow.value = row
  dialogVisible.value = true
}

const AddAction = () => {
  dialogTitle.value = t('exampleDemo.add')
  currentRow.value = undefined
  dialogVisible.value = true
  actionType.value = ''
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

const delData = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要 "${row.title}" 吗？此操作不可恢复。`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    await deleteNotifications(row.id)
    ElMessage.success('删除成功')
    getList()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
      console.error(error)
    }
  }
}
</script>

<template>
  <ContentWrap>
    <Search :schema="searchSchema" @reset="setSearchParams" @search="setSearchParams" />
    <div class="mb-10px">
      <BaseButton type="primary" @click="AddAction">{{ t('exampleDemo.add') }}</BaseButton>
    </div>
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
