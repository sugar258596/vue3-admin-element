<script setup lang="jsx">
import { Form, } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { reactive, watch, ref, } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { useI18n } from '@/hooks/web/useI18n'
import { ElIcon, ElMessage, ElAvatar } from 'element-plus'
import { editUser } from '@/api'

const { t } = useI18n()

const { required } = useValidator()

const props = defineProps({
  currentRow: {
    type: Object,
    default: () => null
  }
})

const imageUrl = ref(props.currentRow?.avatar)


const formSchema = ref([
  {
    field: "name",
    label: "仪器名称",
    component: 'Input',
  },
  {
    field: "model",
    label: "仪器型号",
    component: 'Input',
  },
  {
    field: "serialNumber",
    label: "仪器序列号",
    component: 'Input',
  },
  {
    field: "description",
    label: "仪器描述",
    component: 'Input',
  },
  {
    field: "specifications",
    label: "仪器规格参数",
    component: 'Input',
  },
  {
    field: "qrCode",
    label: "仪器二维码",
    component: 'Input',
  },
  {
    field: 'status',
    label: t('menu.status'),
    component: 'Select',
    value: '0',
    componentProps: {
      options: [
        {
          label: t('userDemo.enable'),
          value: '0'
        },
        {
          label: t('userDemo.disable'),
          value: '1'
        },

      ]
    }
  },
  {
    field: 'images',
    component: 'Upload',
    label: `仪器图片`,
    colProps: {
      span: 24
    },
    componentProps: {
      autoUpload: false,
      action: "#",
      listType: "picture-card",
      limit: 1,
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
            {imageUrl.value ? <ElAvatar src={imageUrl.value} /> : null}
            {!imageUrl.value ? (
              <ElIcon class="avatar-uploader-icon" size="large">
                add
              </ElIcon>
            ) : null}
          </>
        )
      }
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
      // await editLabs(id, newData)
    } else {
      // addLabs(newData)
    }
    return formData
  }
}

watch(
  () => props.currentRow,
  (currentRow) => {
    if (!currentRow) return
    const { images, ...newData } = currentRow
    newData.images = images?.map(item => {
      return {
        url: item,
      }
    }) ?? []
    newData.equipmentList = currentRow.equipmentList.map(item => item.id)
    console.log(newData.equipmentList);

    setValues(newData)
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
