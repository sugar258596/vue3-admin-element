<script setup lang="jsx">
import { ref } from 'vue'
import { Descriptions } from '@/components/Descriptions'
import { ElTag, ElAvatar } from 'element-plus'

defineProps({
  currentRow: {
    type: Object,
    default: () => undefined
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


const detailSchema = ref([
  {
    field: 'title',
    label: '通知标题',
    span: 24,
  },
  {
    field: 'content',
    label: '通知内容',
    span: 24,
  },
  {
    field: 'type',
    label: '状态',
    slots: {
      default: (data) => {
        return renderTag(data.type)
      }
    }
  },
  {
    field: 'user',
    label: '通知用户',
    slots: {
      default: (data) => {
        return (
          <div>{data.user.username}</div>
        )
      }
    }
  },
  {
    field: 'updatedAt',
    label: '通知时间'
  },
])


</script>

<template>
  <Descriptions :schema="detailSchema" :data="currentRow || {}" />
</template>
