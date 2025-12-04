<script setup lang="jsx">
import { reactive, ref, unref } from 'vue'
import { useTable } from '@/hooks/web/useTable'
import { useI18n } from '@/hooks/web/useI18n'
import { Table } from '@/components/Table'
import { ElMessage, ElMessageBox, ElTag } from 'element-plus'
import { Search } from '@/components/Search'
import { ContentWrap } from '@/components/ContentWrap'
import Detail from './components/Detail.vue'
import Reply from './components/Reply.vue'
import { Dialog } from '@/components/Dialog'
import { BaseButton } from '@/components/Button'
import { getFeedbackList, deleteFeedback, updateFeedbackStatus } from '@/api'

const { t } = useI18n()

const searchParams = ref({})

const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      ...searchParams.value
    }
    if (params.status === '') delete params.status
    
    const { list, total } = await getFeedbackList(params)
    return {
      list: list || [],
      total: total
    }
  }
})

const { dataList, loading, total, currentPage, pageSize } = tableState
const { getList } = tableMethods

const statusMap = {
  0: { label: '待处理', type: 'warning' },
  1: { label: '已回复', type: 'primary' },
  2: { label: '已关闭', type: 'info' }
}



const tableColumns = reactive([
  {
    field: 'title',
    label: '标题',
    width: 200
  },
  {
    field: 'content',
    label: '内容',
    slots: {
      default: (data) => {
        const content = data.row.content || ''
        return <div class="line-clamp-2">{content}</div>
      }
    }
  },
  {
    field: 'user',
    label: '提交人',
    width: 120,
    slots: {
      default: (data) => {
        return data.row.user?.nickname || data.row.user?.username || '-'
      }
    }
  },
  {
    field: 'lab',
    label: '实验室',
    width: 150,
    slots: {
      default: (data) => {
        return data.row.lab?.name || '-'
      }
    }
  },
  {
    field: 'status',
    label: '状态',
    width: 100,
    slots: {
      default: (data) => {
        const status = statusMap[data.row.status] || { label: '未知', type: 'info' }
        return <ElTag type={status.type}>{status.label}</ElTag>
      }
    }
  },
  {
    field: 'createdAt',
    label: '提交时间',
    width: 180
  },
  {
    field: 'action',
    label: t('userDemo.action'),
    width: 280,
    slots: {
      default: (data) => {
        const row = data.row
        return (
          <>
            <BaseButton type="primary" size="small" onClick={() => action(row, 'detail')}>
              查看详情
            </BaseButton>
            {row.status !== 2 && (
              <BaseButton type="success" size="small" onClick={() => action(row, 'reply')}>
                回复
              </BaseButton>
            )}
            <BaseButton type="danger" size="small" onClick={() => delData(row)}>
              {t('exampleDemo.del')}
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
    label: '状态',
    component: 'Select',
    componentProps: {
      placeholder: '请选择状态',
      options: [
        { label: '全部', value: '' },
        { label: '待处理', value: 0 },
        { label: '已回复', value: 1 },
        { label: '已关闭', value: 2 }
      ]
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
const replyRef = ref()

const action = (row, type) => {
  dialogTitle.value = type === 'detail' ? '反馈详情' : '回复反馈'
  actionType.value = type
  currentRow.value = row
  dialogVisible.value = true
}

const saveLoading = ref(false)

const save = async () => {
  const reply = unref(replyRef)
  const result = await reply?.submit()
  if (result) {
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
      `确定要删除 "${row.title}" 吗？此操作不可恢复。`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    await deleteFeedback(row.id)
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
    <Table 
      :columns="tableColumns" 
      :data="dataList" 
      :loading="loading" 
      :pagination="{ total }" 
      @register="tableRegister" 
    />
  </ContentWrap>

  <Dialog v-model="dialogVisible" :title="dialogTitle" :width="actionType === 'detail' ? '800px' : '600px'">
    <Detail v-if="actionType === 'detail'" :current-row="currentRow" @refresh="getList" />
    <Reply v-else-if="actionType === 'reply'" ref="replyRef" :current-row="currentRow" />

    <template #footer>
      <BaseButton v-if="actionType === 'reply'" type="primary" :loading="saveLoading" @click="save">
        提交回复
      </BaseButton>
      <BaseButton @click="dialogVisible = false">{{ t('dialogDemo.close') }}</BaseButton>
    </template>
  </Dialog>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
