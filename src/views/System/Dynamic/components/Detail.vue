<script setup>
import { ElDescriptions, ElDescriptionsItem, ElTag, ElSwitch } from 'element-plus'

const props = defineProps({
  currentRow: {
    type: Object,
    default: () => null
  }
})

const parseTags = (tags) => {
  try {
    return typeof tags === 'string' ? JSON.parse(tags) : tags || []
  } catch {
    return []
  }
}
</script>

<template>
  <div v-if="currentRow" class="dynamic-detail">
    <ElDescriptions :column="2" border>
      <ElDescriptionsItem label="标题" :span="2">{{ currentRow.title }}</ElDescriptionsItem>
      <ElDescriptionsItem label="内容" :span="2">
        <div class="content-text">{{ currentRow.content }}</div>
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="parseTags(currentRow.tags).length" label="标签" :span="2">
        <ElTag v-for="(tag, idx) in parseTags(currentRow.tags)" :key="idx" class="mr-2">
          {{ tag }}
        </ElTag>
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="currentRow.coverImage" label="封面图片" :span="2">
        <img :src="currentRow.coverImage" class="cover-image" />
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="currentRow.images?.length" label="图片" :span="2">
        <div class="image-list">
          <img v-for="(img, idx) in currentRow.images" :key="idx" :src="img" class="dynamic-image" />
        </div>
      </ElDescriptionsItem>
      <ElDescriptionsItem label="浏览量">{{ currentRow.viewCount || 0 }}</ElDescriptionsItem>
      <ElDescriptionsItem label="点赞数">{{ currentRow.likeCount || 0 }}</ElDescriptionsItem>
      <ElDescriptionsItem label="创建时间" :span="2">{{ currentRow.createdAt }}</ElDescriptionsItem>
      <ElDescriptionsItem v-if="currentRow.updatedAt" label="更新时间" :span="2">
        {{ currentRow.updatedAt }}
      </ElDescriptionsItem>
    </ElDescriptions>
  </div>
</template>

<style scoped>
.dynamic-detail {
  padding: 20px;
}

.content-text {
  white-space: pre-wrap;
  line-height: 1.6;
}

.cover-image {
  max-width: 300px;
  border-radius: 4px;
}

.image-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.dynamic-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
  cursor: pointer;
}
</style>
