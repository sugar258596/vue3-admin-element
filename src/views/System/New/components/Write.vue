<script setup lang="jsx">
import { Form, } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { reactive, watch, ref, } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { useI18n } from '@/hooks/web/useI18n'
import { ElIcon, ElMessage, ElAvatar } from 'element-plus'
import { addNews, editNews } from '@/api'

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
    field: "title",
    label: "标题",
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: "content",
    label: "内容",
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'tags',
    label: '标签',
    component: 'InputTag',
    colProps: {
      span: 24
    }
  },
  {
    field: 'coverImage',
    component: 'Upload',
    label: `封面图片`,
    colProps: {
      span: 24
    },
    componentProps: {
      autoUpload: false,
      action: "#",
      listType: "picture-card",
      limit: 1,
      multiple: true,
      beforeUpload: (rawFile) => {
        if (rawFile.size / 1024 / 1024 > 2) {
          ElMessage.error('Avatar picture size can not exceed 2MB!')
          return false
        }
        return true
      },
      beforeRemove: () => {
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
    field: 'images',
    component: 'Upload',
    label: `上传图片`,
    colProps: {
      span: 24
    },
    componentProps: {
      autoUpload: false,
      action: "#",
      listType: "picture-card",
      limit: 10,
      multiple: true,
      beforeUpload: (rawFile) => {
        if (rawFile.size / 1024 / 1024 > 2) {
          ElMessage.error('Avatar picture size can not exceed 2MB!')
          return false
        }
        return true
      },
      beforeRemove: () => {
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
    const { id, images, coverImage, tags, ...newData } = formData


    const cover = coverImage?.map(item => {
      // 判断是否为文件
      if (item.raw) {
        return item.raw
      }
      return item?.url
    })
    const image = images?.map(item => {
      // 判断是否为文件
      if (item.raw) {
        return item.raw
      }
      return item?.url
    })
    newData.tags = JSON.stringify(tags)
    newData.images = image
    newData.coverImage = cover

    if (id) {
      await editNews(id, newData)
    } else {
      addNews(newData)
    }
    return formData
  }
}

watch(
  () => props.currentRow,
  (currentRow) => {
    if (!currentRow) return
    const { images, coverImage, lab, ...newData } = currentRow
    newData.coverImage = [
      {
        url: coverImage ?? "",
      }
    ]
    newData.images = images?.map(item => {
      return {
        url: item,
      }
    }) ?? []

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
