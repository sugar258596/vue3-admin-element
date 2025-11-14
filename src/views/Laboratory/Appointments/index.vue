<script setup lang="jsx">
import { reactive, ref, unref } from 'vue'
import { getAppointmentsList } from '@/api'

import { useTable } from '@/hooks/web/useTable'
import { useI18n } from '@/hooks/web/useI18n'
import { Table, } from '@/components/Table'
import { Search } from '@/components/Search'
import { ContentWrap } from '@/components/ContentWrap'
import Write from './components/Write.vue'
import Detail from './components/Detail.vue'
import { Dialog } from '@/components/Dialog'
import { BaseButton } from '@/components/Button'

const { t } = useI18n()

const searchParams = ref({

})

const timeSlot = {
  0: '上午',
  1: '下午',
  2: '晚上'
}

const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const { list, total } = await getAppointmentsList(searchParams.value)
    return {
      list: list || [],
      total: total
    }
  }
})

const { dataList, loading, total } = tableState
const { getList } = tableMethods

const tableColumns = reactive([
  {
    field: 'index',
    label: t('userDemo.index'),
    type: 'index'
  },
  {
    field: 'name',
    label: '实验室名称',
    slots: {
      default: (data) => {
        return (
          <>
            <div>{data.row.lab.name}</div>
          </>
        )
      }
    }
  },
  {
    field: 'user',
    label: '预约用户',
    slots: {
      default: (data) => {
        return (
          <>
            <div>{data.row.user.name}</div>
          </>
        )
      }
    }
  },
  {
    field: 'purpose',
    label: '预约目的'
  },
  {
    field: 'description',
    label: '预约详细描述'
  },
  {
    field: 'appointmentDate',
    label: '预约日期',
  },
  {
    field: 'timeSlot',
    label: '时间段',
    slots: {
      default: (data) => {
        return (
          <>
            <div>{timeSlot[data.row.timeSlot]}</div>
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
