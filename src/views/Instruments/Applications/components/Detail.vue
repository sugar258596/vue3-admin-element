<script setup lang="jsx">
import { ref } from 'vue'
import { Descriptions } from '@/components/Descriptions'
import { ElTag } from 'element-plus'

defineProps({
  currentRow: {
    type: Object,
    default: () => undefined
  }
})


const renderTag = (enable) => {
  switch (enable) {
    case 0:
      return <ElTag type='warning'>待审核</ElTag>
    case 1:
      return <ElTag type='success'>已通过</ElTag>
    case 2:
      return <ElTag type='danger'>已拒绝</ElTag>
    default:
      return <ElTag type='danger'>已拒绝</ElTag>
  }
}


const detailSchema = ref([
  {
    field: 'name',
    label: '仪器名称',
    slots: {
      default: (data) => {
        return (
          <>
            <div>{data.instrument?.name}</div>
          </>
        )
      }
    }
  },
  {
    field: 'serialNumber',
    label: '设备序列号',
    slots: {
      default: (data) => {
        return (
          <>
            <div>{data.instrument?.serialNumber}</div>
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
    field: 'createdAt',
    label: '预约日期',
  },
  {
    field: 'username',
    label: '预约人',
    slots: {
      default: (data) => {
        return (
          <>
            <div>{data.applicant?.username}</div>
          </>
        )
      }
    },
  },
  {
    field: 'status',
    label: '审核状态',
    slots: {
      default: (data) => {
        return renderTag(data.status)
      }
    }
  },
  {
    field: 'rejectionReason',
    label: '拒绝原因',
  },
])
</script>

<template>
  <Descriptions :schema="detailSchema" :data="currentRow || {}" />
</template>
