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

import { getInstrumentsList, detailedInstruments } from '@/api'

const { t } = useI18n()

const searchParams = ref({})

const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const { list, total } = await getInstrumentsList(searchParams.value)
    return {
      list: list || [],
      total: total
    }
  }
})


const renderTag = (enable) => {
  switch (enable) {
    case 0:
      return <ElTag type='success'>正常</ElTag>
    case 1:
      return <ElTag type='danger'>停用</ElTag>
    case 2:
      return <ElTag type='warning'>维护中</ElTag>
    case 3:
      return <ElTag type='danger'>故障</ElTag>
    case 4:
      return <ElTag type='info'>借出</ElTag>
    default:
      return <ElTag type='danger'>停用</ElTag>
  }
}

const { dataList, loading, total } = tableState
const { getList } = tableMethods

const tableColumns = reactive([
  {
    field: 'id',
    label: 'ID',
  },
  {
    field: 'name',
    label: '设备名称'
  },
  {
    field: 'model',
    label: '设备型号'
  },
  {
    field: 'serialNumber',
    label: '设备序列号'
  },
  {
    field: 'description',
    label: '设备描述'
  },
  {
    field: 'specifications',
    label: '设备技术规格'
  },
  {
    field: 'status',
    label: t('menu.status'),
    slots: {
      default: (data) => {
        return renderTag(data.row.status)
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
              {t('exampleDemo.edit')}
            </BaseButton>
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
    label: "关键字",
    component: 'Input'
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
      `确定要 "${row.name}" 吗？此操作不可恢复。`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    await detailedInstruments(row.id)
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
