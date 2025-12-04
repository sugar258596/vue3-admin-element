<script setup lang="jsx">
import { reactive, ref, unref } from 'vue'
import { useTable } from '@/hooks/web/useTable'
import { useI18n } from '@/hooks/web/useI18n'
import { Table } from '@/components/Table'
import { ElMessage, ElMessageBox, ElTag, ElSwitch } from 'element-plus'
import { Search } from '@/components/Search'
import { ContentWrap } from '@/components/ContentWrap'
import Write from './components/Write.vue'
import Detail from './components/Detail.vue'
import { Dialog } from '@/components/Dialog'
import { BaseButton } from '@/components/Button'
import { getDynamicList, deleteDynamic, toggleDynamicPublish } from '@/api'

const { t } = useI18n()

const searchParams = ref({})

const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      ...searchParams.value
    }
    if (!params.keyword) delete params.keyword
    
    const { list, total } = await getDynamicList(params)
    return {
      list: list || [],
      total: total
    }
  }
})

const { dataList, loading, total, currentPage, pageSize } = tableState
const { getList } = tableMethods

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
    field: 'coverImage',
    label: '封面',
    width: 100,
    slots: {
      default: (data) => {
        return data.row.coverImage ? (
          <div class="w-16 h-16">
            <img class="w-full h-full object-cover rounded" src={data.row.coverImage} />
          </div>
        ) : '-'
      }
    }
  },
  {
    field: 'viewCount',
    label: '浏览量',
    width: 100
  },
  {
    field: 'likeCount',
    label: '点赞数',
    width: 100
  },
  {
    field: 'createdAt',
    label: '创建时间',
    width: 180
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
            <BaseButton type="primary" size="small" onClick={() => action(row, 'edit')}>
              {t('exampleDemo.edit')}
            </BaseButton>
            <BaseButton type="success" size="small" onClick={() => action(row, 'detail')}>
              {t('exampleDemo.detail')}
            </BaseButton>
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
      `确定要删除 "${row.title}" 吗？此操作不可恢复。`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    await deleteDynamic(row.id)
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
    <Table 
      :columns="tableColumns" 
      :data="dataList" 
      :loading="loading" 
      :pagination="{ total }" 
      @register="tableRegister" 
    />
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

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
