<script setup>
import { Form } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { reactive, watch } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { replyFeedback } from '@/api'
import { ElMessage } from 'element-plus'

const { required } = useValidator()

const props = defineProps({
  currentRow: {
    type: Object,
    default: () => null
  }
})

const formSchema = reactive([
  {
    field: 'content',
    label: '回复内容',
    component: 'Input',
    componentProps: {
      type: 'textarea',
      rows: 6,
      placeholder: '请输入回复内容'
    },
    colProps: {
      span: 24
    }
  }
])

const rules = reactive({
  content: [required()]
})

const { formRegister, formMethods } = useForm()
const { getFormData, getElFormExpose } = formMethods

const submit = async () => {
  const elForm = await getElFormExpose()
  const valid = await elForm?.validate().catch((err) => {
    console.log(err)
  })
  if (valid) {
    const formData = await getFormData()
    try {
      await replyFeedback(props.currentRow.id, formData)
      ElMessage.success('回复成功')
      return formData
    } catch (error) {
      ElMessage.error('回复失败')
      return null
    }
  }
}

defineExpose({
  submit
})
</script>

<template>
  <div class="reply-form">
    <div class="feedback-info mb-4">
      <p><strong>反馈标题：</strong>{{ currentRow?.title }}</p>
      <p><strong>反馈内容：</strong>{{ currentRow?.content }}</p>
    </div>
    <Form :rules="rules" @register="formRegister" :schema="formSchema" />
  </div>
</template>

<style scoped>
.reply-form {
  padding: 20px;
}

.feedback-info {
  background: #f5f7fa;
  padding: 15px;
  border-radius: 4px;
}

.feedback-info p {
  margin: 8px 0;
  line-height: 1.6;
}
</style>
