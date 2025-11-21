<script setup lang="jsx">
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { Dialog } from '@/components/Dialog'
import { useI18n } from '@/hooks/web/useI18n'
import { ElTag } from 'element-plus'
import { Table } from '@/components/Table'
import {
  getDepartmentApi,
  getDepartmentTableApi,
  saveDepartmentApi,
  deleteDepartmentApi
} from '@/api/department'
import { useTable } from '@/hooks/web/useTable'
import { ref, unref, reactive } from 'vue'
import Write from './components/Write.vue'
import Detail from './components/Detail.vue'
import { useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { BaseButton } from '@/components/Button'

const ids = ref([])

const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const { currentPage, pageSize } = tableState
    const res = await getDepartmentTableApi({
      pageIndex: unref(currentPage),
      pageSize: unref(pageSize),
      ...unref(searchParams)
    })
    return {
      list: res.data.list,
      total: res.data.total
    }
  },
  fetchDelApi: async () => {
    const res = await deleteDepartmentApi(unref(ids))
    return !!res
  }
})
const { loading, dataList, total, currentPage, pageSize } = tableState
const { getList, getElTableExpose, delList } = tableMethods

const searchParams = ref({})
const setSearchParams = (params) => {
  searchParams.value = params
  getList()
}

const { t } = useI18n()

const crudSchemas = reactive([
  {
    field: 'selection',
    search: {
      hidden: true
    },
    form: {
      hidden: true
    },
    detail: {
      hidden: true
    },
    table: {
      type: 'selection'
    }
  },
  {
    field: 'index',
    label: t('tableDemo.index'),
    type: 'index',
    search: {
      hidden: true
    },
    form: {
      hidden: true
    },
    detail: {
      hidden: true
    }
  },
  {
    field: 'id',
    label: t('userDemo.departmentName'),
    table: {
      slots: {
        default: (data) => {
          return <>{data.row.departmentName}</>
        }
      }
    },
    form: {
      component: 'TreeSelect',
      componentProps: {
        nodeKey: 'id',
        props: {
          label: 'departmentName'
        }
      },
      optionApi: async () => {
        const res = await getDepartmentApi()
        return res.data.list
      }
    },
    detail: {
      slots: {
        default: (data) => {
          return <>{data.departmentName}</>
        }
      }
    }
  },
  {
    field: 'status',
    label: t('userDemo.status'),
    search: {
      hidden: true
    },
    table: {
      slots: {
        default: (data) => {
          const status = data.row.status
          return (
            <>
              <ElTag type={status === 0 ? 'danger' : 'success'}>
                {status === 1 ? t('userDemo.enable') : t('userDemo.disable')}
              </ElTag>
            </>
          )
        }
      }
    },
    form: {
      component: 'Select',
      componentProps: {
        options: [
          {
            value: '0',
            label: t('userDemo.disable')
          },
          {
            value: '1',
            label: t('userDemo.enable')
          }
        ]
      }
    },
    detail: {
      slots: {
        default: (data) => {
          return (
            <>
              <ElTag type={data.status === '0' || data.status === 0 ? 'danger' : 'success'}>
                {data.status === '1' || data.status === 1 ? t('userDemo.enable') : t('userDemo.disable')}
              </ElTag>
            </>
          )
        }
      }
    }
  },
  {
    field: 'createTime',
    label: t('tableDemo.displayTime'),
    search: {
      hidden: true
    },
    form: {
      hidden: true
    }
  },
  {
    field: 'remark',
    label: t('userDemo.remark'),
    search: {
      hidden: true
    },
    form: {
      component: 'Input',
      componentProps: {
        type: 'textarea',
        rows: 5
      },
      colProps: {
        span: 24
      }
    },
    detail: {
      slots: {
        default: (data) => {
          return <>{data.remark}</>
        }
      }
    }
  },
  {
    field: 'action',
    width: '260px',
    label: t('tableDemo.action'),
    search: {
      hidden: true
    },
    form: {
      hidden: true
    },
    detail: {
      hidden: true
    },
    table: {
      slots: {
        default: (data) => {
          return (
            <>
              <BaseButton type="primary" onClick={() => action(data.row, 'edit')}>
                {t('exampleDemo.edit')}
              </BaseButton>
              <BaseButton type="success" onClick={() => action(data.row, 'detail')}>
                {t('exampleDemo.detail')}
              </BaseButton>
              <BaseButton type="danger" onClick={() => delData(data.row)}>
                {t('exampleDemo.del')}
              </BaseButton>
            </>
          )
        }
      }
    }
  }
])

// @ts-ignore
const { allSchemas } = useCrudSchemas(crudSchemas)

const dialogVisible = ref(false)
const dialogTitle = ref('')

const currentRow = ref(null)
const actionType = ref('')

const AddAction = () => {
  dialogTitle.value = t('exampleDemo.add')
  currentRow.value = null
  dialogVisible.value = true
  actionType.value = ''
}

const delLoading = ref(false)

const delData = async (row) => {
  const elTableExpose = await getElTableExpose()
  ids.value = row
    ? [row.id]
    : elTableExpose?.getSelectionRows().map((v) => v.id) || []
  delLoading.value = true
  await delList(unref(ids).length).finally(() => {
    delLoading.value = false
  })
}

const action = (row, type) => {
  dialogTitle.value = t(type === 'edit' ? 'exampleDemo.edit' : 'exampleDemo.detail')
  actionType.value = type
  currentRow.value = row
  dialogVisible.value = true
}

const writeRef = ref()

const saveLoading = ref(false)

const save = async () => {
  const write = unref(writeRef)
  const formData = await write?.submit()
  if (formData) {
    saveLoading.value = true
    const res = await saveDepartmentApi(formData)
      .catch(() => { })
      .finally(() => {
        saveLoading.value = false
      })
    if (res) {
      dialogVisible.value = false
      currentPage.value = 1
      getList()
    }
  }
}
</script>

<template>
  <ContentWrap>
    <Search :schema="allSchemas.searchSchema" @search="setSearchParams" @reset="setSearchParams" />

    <div class="mb-10px">
      <BaseButton type="primary" @click="AddAction">{{ t('exampleDemo.add') }}</BaseButton>
      <BaseButton :loading="delLoading" type="danger" @click="delData(null)">
        {{ t('exampleDemo.del') }}
      </BaseButton>
    </div>

    <Table v-model:pageSize="pageSize" v-model:currentPage="currentPage" :columns="allSchemas.tableColumns"
      :data="dataList" :loading="loading" :pagination="{
        total: total
      }" @register="tableRegister" />
  </ContentWrap>

  <Dialog v-model="dialogVisible" :title="dialogTitle">
    <Write v-if="actionType !== 'detail'" ref="writeRef" :form-schema="allSchemas.formSchema"
      :current-row="currentRow" />

    <Detail v-if="actionType === 'detail'" :detail-schema="allSchemas.detailSchema" :current-row="currentRow" />

    <template #footer>
      <BaseButton v-if="actionType !== 'detail'" type="primary" :loading="saveLoading" @click="save">
        {{ t('exampleDemo.save') }}
      </BaseButton>
      <BaseButton @click="dialogVisible = false">{{ t('dialogDemo.close') }}</BaseButton>
    </template>
  </Dialog>
</template>
