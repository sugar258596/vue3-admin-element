<script setup lang="jsx">
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { Table, TableColumn } from '@/components/Table'
import { getTableListApi } from '@/api/table'
import { ref } from 'vue'


const { t } = useI18n()

const columns = [
  {
    field: 'title',
    label: t('tableDemo.title')
  },
  {
    field: 'video_uri',
    label: t('tableDemo.videoPreview')
  },
  {
    field: 'author',
    label: t('tableDemo.author')
  },
  {
    field: 'display_time',
    label: t('tableDemo.displayTime')
  },
  {
    field: 'pageviews',
    label: t('tableDemo.pageviews')
  }
]

const loading = ref(true)

const tableDataList = ref([])

const getTableList = async (params) => {
  const res = await getTableListApi(
    params || {
      pageIndex: 1,
      pageSize: 10
    }
  )
    .catch(() => { })
    .finally(() => {
      loading.value = false
    })
  if (res) {
    tableDataList.value = res.data.list
  }
}

getTableList()
</script>

<template>
  <ContentWrap :title="t('router.PicturePreview')">
    <Table :columns="columns" :data="tableDataList" :loading="loading" :video-preview="['image_uri', 'video_uri']" />
  </ContentWrap>
</template>
