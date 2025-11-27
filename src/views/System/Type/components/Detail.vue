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
      return <ElTag type='success'>启用</ElTag>
    case 1:
      return <ElTag type='danger'>禁用</ElTag>
    default:
      return <ElTag type='danger'>禁用</ElTag>
  }
}


const detailSchema = ref([
  {
    field: 'name',
    label: '类型名称',
    span: 24,
  },
  {
    field: 'description',
    label: '类型描述',
    span: 24,
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
])


</script>

<template>
  <Descriptions :schema="detailSchema" :data="currentRow || {}" />
</template>
