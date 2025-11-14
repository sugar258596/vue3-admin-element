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


const timeSlot = {
  0: '上午',
  1: '下午',
  2: '晚上'
}


const renderTag = (enable) => {
  switch (enable) {
    case 1:
      return <ElTag type='success'>已预约</ElTag>
    case 2:
      return <ElTag type='danger'>已拒绝</ElTag>
    case 3:
      return <ElTag type='warning'>已取消</ElTag>
    case 4:
      return <ElTag type='success'>已完成</ElTag>
    default:
      return <ElTag type='info'>待审核</ElTag>
  }
}


const detailSchema = ref([
  {
    field: 'name',
    label: '实验室名称',
    slots: {
      default: (data) => {
        return (
          <>
            <div>{data.name}</div>
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
            <div>{data.user.name}</div>
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
    field: 'participantCount',
    label: '参与人数'
  },
  {
    field: 'appointmentDate',
    label: '预约日期',
  },
  {
    field: 'status',
    label: '状态',
    slots: {
      default: (data) => {
        return renderTag(data.status)
      }
    }
  },
  {
    field: 'timeSlot',
    label: '时间段',
    slots: {
      default: (data) => {
        return (
          <>
            <div>{timeSlot[data.timeSlot]}</div>
          </>
        )
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
