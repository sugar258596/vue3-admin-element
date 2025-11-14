<script setup>
import { DepartmentItem } from '@/api/department/types'
import { Descriptions, DescriptionsSchema } from '@/components/Descriptions'

defineProps({
  currentRow: {
    type: Object,
    default: () => null
  },
  detailSchema: {
    type: Array,
    default: () => []
  }
})
</script>

<template>
  <Descriptions :schema="detailSchema" :data="currentRow || {}" />
</template>
