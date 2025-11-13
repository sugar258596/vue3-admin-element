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
  return <ElTag type={enable === 1 ? 'danger' : 'success'}>{enable === 1 ? '启用' : '禁用'}</ElTag>
}




const detailSchema = ref([
  {
    field: 'username',
    label: '用户名'
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
    field: 'avatar',
    label: '头像',
    span: 24,
    slots: {
      default: (data) => {
        return <ElAvatar src={data.avatar} />
      }
    }
  },
  {
    field: 'role',
    label: '用户角色',
  },
  {
    field: 'nickname',
    label: '用户昵称',
  },
  {
    field: 'phone',
    label: '手机号',
    span: 24
  },
  {
    field: 'email',
    label: '用户邮箱',
    span: 24
  },
  {
    field: 'department',
    label: '所属院系/部门',
    span: 24
  },
  {
    field: 'text',
    label: '教学标签数组',
    span: 24
  },
])
</script>

<template>
  <Descriptions :schema="detailSchema" :data="currentRow || {}" />
</template>
