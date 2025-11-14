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


const detailSchema = ref([

  {
    field: 'model',
    label: '设备型号',
    span: 24,
  },
  {
    field: 'serialNumber',
    label: '设备序列号',
    span: 24,
  },
  {
    field: 'description',
    label: '设备描述',
    span: 24,
  },
  {
    field: 'specifications',
    label: '设备技术规格',
    span: 24,
  },
  {
    field: 'labName',
    label: '所属实验室',
    span: 24,
    slots: {
      default: (data) => {
        return (
          <div> {data.lab?.name} </div>
        )
      }
    }
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
    label: '展示图片',
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
