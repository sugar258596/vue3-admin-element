<script setup lang="jsx">
import { Form, } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { reactive, watch, ref, } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { useI18n } from '@/hooks/web/useI18n'
import { ElIcon, ElMessage, ElAvatar } from 'element-plus'
import { addLabs, editLabs, getInstrumentsOptions } from '@/api'

const { t } = useI18n()

const { required } = useValidator()

const props = defineProps({
  currentRow: {
    type: Object,
    default: () => null
  }
})



const remoteMethod = async (keyword) => {
  const { list } = await getInstrumentsOptions({
    keyword,
    page: 1,
    pageSize: 100,
  })

  return list.map(item => {
    return {
      label: item.name,
      value: item.id,
    }
  })

}


const formSchema = ref([
  {
    field: 'name',
    label: '实验室名称',
    component: 'Input',
  },
  {
    field: 'capacity',
    label: '实验室容量 (人数)',
    component: 'InputNumber',
  },
  {
    field: 'department',
    label: '所属院系',
    component: 'Input',
  },
  {
    field: 'description',
    label: '实验室描述',
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      type: 'textarea'
    }
  },
  {
    field: 'location',
    label: '实验室地址',
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      type: 'textarea'
    }
  },

  {
    field: 'images',
    component: 'Upload',
    label: "实验室图片",
    colProps: {
      span: 24
    },
    componentProps: {
      autoUpload: false,
      action: "#",
      listType: "picture-card",
      limit: 10,
      multiple: true,
      onChange: (uploadFile) => {
        imageUrl.value = uploadFile.url
      },
      beforeUpload: (rawFile) => {
        if (rawFile.size / 1024 / 1024 > 2) {
          ElMessage.error('Avatar picture size can not exceed 2MB!')
          return false
        }
        return true
      },
      beforeRemove: () => {
        imageUrl.value = ''
      },
      slots: {
        default: () => (
          <>
            <ElIcon class="avatar-uploader-icon" size="large">
              add
            </ElIcon>
          </>
        )
      }
    }
  },

  {
    field: 'status',
    label: t('menu.status'),
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
    }
  },
  {
    field: 'tags',
    label: '实验室标签',
    component: 'InputTag'
  },
  {
    field: 'instrumentIds',
    label: '实验室设备',
    component: 'SelectV2',
    componentProps: {
      multiple: true,
      filterable: true,
      allowCreate: true,
      options: [],
    },
    optionApi: remoteMethod,
    colProps: {
      span: 24
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
      await editLabs(id, newData)
    } else {
      addLabs(newData)
    }

    return formData
  }
}

watch(
  () => props.currentRow,
  (currentRow) => {
    if (!currentRow) return
    const { images, ...newData } = currentRow
    newData.images = images.map(item => {
      return {
        url: item,
      }
    })
    remoteMethod()
    newData.instrumentIds = currentRow.instruments.map(item => item.id)
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
