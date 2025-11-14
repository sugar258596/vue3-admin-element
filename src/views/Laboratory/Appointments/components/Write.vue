<script setup lang="jsx">
import { Form, } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { reactive, watch, ref, } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { useI18n } from '@/hooks/web/useI18n'
import { ElIcon, ElMessage, ElAvatar } from 'element-plus'
import { updateReview } from '@/api'

const { t } = useI18n()

const { required } = useValidator()

const props = defineProps({
  currentRow: {
    type: Object,
    default: () => null
  }
})


const formSchema = ref([

  {
    field: 'status',
    label: '审核',
    component: 'Select',
    componentProps: {
      options: [
        {
          label: '待审核',
          value: 0
        },
        {
          label: '通过',
          value: 1
        },
        {
          label: '拒绝',
          value: 2
        },

      ]
    },
    colProps: {
      span: 24
    },
  },

  {
    field: 'reason',
    label: '审核意见',
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      type: 'textarea'
    }
  },
])

const rules = reactive({
  roleName: [required()],
  role: [required()],
})

const { formRegister, formMethods } = useForm()
const { setValues, getFormData, getElFormExpose } = formMethods


const submit = async () => {
  const elForm = await getElFormExpose()
  const valid = await elForm?.validate().catch((err) => {
  })
  if (valid) {
    const formData = await getFormData()
    const { id, ...newData } = formData


    if (id) {
      await updateReview(id, newData)
    }
    return formData
  }
}

watch(
  () => props.currentRow,
  (currentRow) => {
    if (!currentRow) return

    setValues(currentRow)
  },
  {
    deep: true,
    immediate: true
  }
)

defineExpose({
  submit
})
</script>

<template>
  <Form :rules="rules" @register="formRegister" :schema="formSchema" />
</template>


<style lang="less">
.el-upload {
  position: relative;
  overflow: hidden;
  cursor: pointer;
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  transition: var(--el-transition-duration-fast);
}

.el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  width: 140px;
  height: 140px;
  font-size: 28px;
  color: #8c939d;
  text-align: center;
}
</style>
