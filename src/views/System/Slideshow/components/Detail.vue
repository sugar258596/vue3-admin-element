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
    field: 'title',
    label: '轮播图标题',
    span: 24,
  },
  {
    field: 'type',
    label: '所属类型',
    span: 24,
    slots: {
      default: (data) => {
        return (
          <div> {data.type?.name} </div>
        )
      }
    }
  },
  {
    field: 'description',
    label: '描述信息',
    span: 24,
  },
  {
    field: 'link',
    label: '链接地址',
    span: 24,
  },
  {
    field: 'createdAt',
    label: '创建时间',
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
  {
    field: 'images',
    label: '图片',
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
])


</script>

<template>
  <Descriptions :schema="detailSchema" :data="currentRow || {}" />
</template>
