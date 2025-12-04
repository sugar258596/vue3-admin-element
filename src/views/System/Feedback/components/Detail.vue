<script setup>
import { ref, watch } from 'vue'
import { ElDescriptions, ElDescriptionsItem, ElTag, ElButton, ElMessage } from 'element-plus'
import { updateFeedbackStatus } from '@/api'

const props = defineProps({
  currentRow: {
    type: Object,
    default: () => null
  }
})

const emit = defineEmits(['refresh'])

const statusMap = {
  0: { label: '待处理', type: 'warning' },
  1: { label: '已回复', type: 'primary' },
  2: { label: '已关闭', type: 'info' }
}

const updateStatus = async (status) => {
  try {
    await updateFeedbackStatus(props.currentRow.id, status)
    ElMessage.success('状态更新成功')
    emit('refresh')
  } catch (error) {
    ElMessage.error('状态更新失败')
  }
}
</script>

<template>
  <div v-if="currentRow" class="feedback-detail">
    <ElDescriptions :column="2" border>
      <ElDescriptionsItem label="状态">
        <ElTag :type="statusMap[currentRow.status]?.type">
          {{ statusMap[currentRow.status]?.label || '未知' }}
        </ElTag>
      </ElDescriptionsItem>
      <ElDescriptionsItem label="实验室">
        {{ currentRow.lab?.name || '-' }}
      </ElDescriptionsItem>
      <ElDescriptionsItem label="标题" :span="2">{{ currentRow.title }}</ElDescriptionsItem>
      <ElDescriptionsItem label="提交人">
        {{ currentRow.user?.nickname || currentRow.user?.username || '-' }}
      </ElDescriptionsItem>
      <ElDescriptionsItem label="预约时间">
        {{ currentRow.appointment?.appointmentDate || '-' }}
      </ElDescriptionsItem>
      <ElDescriptionsItem label="提交时间" :span="2">{{ currentRow.createdAt }}</ElDescriptionsItem>
      <ElDescriptionsItem label="内容" :span="2">
        <div class="content-text">{{ currentRow.content }}</div>
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="currentRow.replies?.length" label="回复记录" :span="2">
        <div v-for="reply in currentRow.replies" :key="reply.id" class="reply-item">
          <div class="reply-header">
            <span class="reply-user">{{ reply.user?.nickname || reply.user?.username }}</span>
            <span class="reply-time">{{ reply.createdAt }}</span>
          </div>
          <div class="reply-content">{{ reply.content }}</div>
        </div>
      </ElDescriptionsItem>
    </ElDescriptions>

    <div v-if="currentRow.status !== 2" class="mt-4 flex gap-2">
      <ElButton v-if="currentRow.status === 0" type="primary" @click="updateStatus(1)">
        标记为已回复
      </ElButton>
      <ElButton type="info" @click="updateStatus(2)">关闭反馈</ElButton>
    </div>
  </div>
</template>

<style scoped>
.feedback-detail {
  padding: 20px;
}

.content-text {
  white-space: pre-wrap;
  line-height: 1.6;
}

.image-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.feedback-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
  cursor: pointer;
}

.reply-item {
  background: #f5f7fa;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 10px;
}

.reply-item:last-child {
  margin-bottom: 0;
}

.reply-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 12px;
  color: #909399;
}

.reply-user {
  font-weight: 600;
  color: #303133;
}

.reply-content {
  white-space: pre-wrap;
  line-height: 1.6;
  color: #606266;
}
</style>
