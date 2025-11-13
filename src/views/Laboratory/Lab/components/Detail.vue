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
  return <ElTag type={enable === 1 ? 'danger' : 'success'}>{enable === 1 ? '启用' : '禁用'}</ElTag>
}


const detailSchema = ref([
  {
    field: 'name',
    label: '实验室名称'
  },
  {
    field: 'department',
    label: '所属院系'
  },
  {
    field: 'description',
    label: '实验室描述'
  },
  {
    field: 'location',
    label: '实验室地址'
  },
  {
    field: 'rating',
    label: '评分'
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
    field: 'image',
    label: '实验室图片',
    span: 24,
    slots: {
      default: (data) => {
        return (
          <div class={'flex flex-wrap gap-2'}>
            {data.images?.map((item, index) => (
              <div class={'w-20 h-20'}>
                <img class={'w-full h-full object-cover'} key={index} src={item} />
              </div>
            ))}
          </div>
        )
      }
    }
  },
  {
    field: 'tags',
    label: '实验室标签',
    span: 24,
    slots: {
      default: (data) => {
        return (
          <div class={'flex flex-wrap gap-2'}>
            {data.tags?.map((item, index) => (
              <ElTag type="primary">{item}</ElTag>
            ))}
          </div>
        )
      }
    }
  },
  {
    field: 'equipmentList',
    label: '实验室设备',
    span: 24,
    slots: {
      default: (data) => {
        return (
          <div class={'flex flex-wrap gap-2'}>
            {data.equipmentList?.map((item) => (
              <ElTag type="primary">{item.name}</ElTag>
            ))}
          </div>
        )
      }
    }
  },
])
</script>

<template>
  <Descriptions :schema="detailSchema" :data="currentRow || {}" />
</template>
