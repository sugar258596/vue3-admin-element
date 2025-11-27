<script setup lang="jsx">
import { Form, } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { reactive, watch, ref, } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { useI18n } from '@/hooks/web/useI18n'
import { ElIcon, ElMessage, ElAvatar } from 'element-plus'
import { addBannerType, editBannerType } from '@/api'

const { t } = useI18n()

const { required } = useValidator()

const props = defineProps({
  currentRow: {
    type: Object,
    default: () => null
  }
})

const options = ref([])




const formSchema = ref([
  {
    field: "name",
    label: "类型名称",
    component: 'Input',
    colProps: {
      span: 24
    },
  },

  {
    field: "description",
    label: "类型描述",
    component: 'Input',
    componentProps: {
      type: 'textarea'
    },
    colProps: {
      span: 24
    },
  },
  {
    field: 'status',
    label: '状态',
    component: 'Select',
    value: 0,
    componentProps: {
      options: [
        {
          label: t('userDemo.enable'),
          value: 0
        },
        {
          label: t('userDemo.disable'),
          value: 1
        },

      ]
    },
    colProps: {
      span: 24
    },
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
    console.log(err)
  })
  if (valid) {
    const formData = await getFormData()
    const { id, images, ...newData } = formData


    const image = images?.map(item => {
      // 判断是否为文件
      if (item.raw) {
        return item.raw
      }
      return item?.url
    })
    newData.images = image


    if (id) {
      await editBannerType(id, newData)
    } else {
      addBannerType(newData)
    }
    return formData
  }
}

watch(
  () => props.currentRow,
  (currentRow) => {
    if (!currentRow) return
    const { images, lab, ...newData } = currentRow
    newData.images = images?.map(item => {
      return {
        url: item,
      }
    }) ?? []

    newData.lab = lab?.id

    setValues(newData)
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
