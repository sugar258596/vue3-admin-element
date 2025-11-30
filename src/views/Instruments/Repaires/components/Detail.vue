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
      return <ElTag type='danger'>硬件故障</ElTag>
    case 1:
      return <ElTag type='warning'>软件故障</ElTag>
    case 2:
      return <ElTag type='primary'>操作错误</ElTag>
    case 3:
      return <ElTag type='info'>其他</ElTag>
    default:
      return <ElTag type='info'>待审核</ElTag>
  }
}
const faultType = (enable) => {
  switch (enable) {
    case 0:
      return <ElTag type='info'>低</ElTag>
    case 1:
      return <ElTag type='warning'>中</ElTag>
    case 2:
      return <ElTag type='danger'>高</ElTag>
    case 3:
      return <ElTag type='danger'>紧急</ElTag>
    default:
      return <ElTag type='danger'>紧急</ElTag>
  }
}
const status = (enable) => {
  switch (enable) {
    case 0:
      return <ElTag type='warning'>待处理</ElTag>
    case 1:
      return <ElTag type='primary'>维修中</ElTag>
    case 2:
      return <ElTag type='success'>已完成</ElTag>
    default:
      return <ElTag type='info'>待处理</ElTag>
  }
}

const detailSchema = ref([
  {
    field: 'repairNumber',
    label: '维修单号',
  },
  {
    field: 'instrument',
    label: '报修设备',
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
    field: 'model',
    label: '设备序列号',
    slots: {
      default: (data) => {
        return (
          <>
            <div>{data.instrument?.model}</div>
          </>
        )
      }
    }
  },
  {
    field: 'reporter',
    label: '报修用户',
    slots: {
      default: (data) => {
        return (
          <>
            <div>{data.reporter?.username}</div>
          </>
        )
      }
    }
  },
  {
    field: 'faultType',
    label: '故障类型',
    slots: {
      default: (data) => {
        return (
          <>
            <div>{renderTag(data.faultType)}</div>
          </>
        )
      }
    }
  },
  {
    field: 'urgency',
    label: '紧急程度',
    slots: {
      default: (data) => {
        return (
          <>
            <div>{faultType(data.urgency)}</div>
          </>
        )
      }
    }
  },
  {
    field: 'status',
    label: '维修状态',
    slots: {
      default: (data) => {
        return (
          <>
            <div>{status(data.status)}</div>
          </>
        )
      }
    }
  },
  {
    field: 'description',
    label: '故障详细描述'
  },
  {
    field: 'images',
    label: '故障图片',
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
    field: 'createdAt',
    label: '报修时间',
  },
  {
    field: 'completedAt',
    label: '完成时间',
  },
  {
    field: 'repairSummary',
    label: '维修总结',
  },

])
</script>

<template>
  <Descriptions :schema="detailSchema" :data="currentRow || {}" />
</template>
