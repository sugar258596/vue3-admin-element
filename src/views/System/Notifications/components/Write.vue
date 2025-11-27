<script setup lang="jsx">
import { Form, } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { reactive, watch, ref, } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { useI18n } from '@/hooks/web/useI18n'
import { ElIcon, ElMessage, ElAvatar } from 'element-plus'
import { addNotifications, editBannerType, getUserList } from '@/api'

const { t } = useI18n()

const { required } = useValidator()

const props = defineProps({
  currentRow: {
    type: Object,
    default: () => null
  }
})

const options = ref([])


const remoteMethod = async (keyword) => {
  const { list } = await getUserList({
    keyword,
    page: 1,
    pageSize: 100,
  })

  options.value = [
    {
      label: '全部用户',
      value: 0,
    },
    ...list.map(item => ({
      label: item.username,
      value: item.id,
    }))
  ]

  return options.value
}




const formSchema = ref([
  {
    field: "userId",
    label: "通知用户",
    component: 'Select',
    componentProps: {
      options: []
    },
    optionApi: remoteMethod,
    colProps: {
      span: 24
    },
  },
  {
    field: 'type',
    label: '通知类型',
    component: 'Select',
    value: 1,
    componentProps: {
      options: [
        {
          label: '预约审核',
          value: 0
        },
        {
          label: '临时通知',
          value: 1
        },
        {
          label: '预约提醒',
          value: 2
        },
        {
          label: '设备申请',
          value: 3
        },
        {
          label: '维修进度',
          value: 4
        },

      ]
    },
    colProps: {
      span: 24
    },
  },
  {
    field: "title",
    label: "通知标题",
    component: 'Input',
    colProps: {
      span: 24
    },
  },
  {
    field: "content",
    label: "通知内容",
    component: 'Input',
    colProps: {
      span: 24
    },
  },
  {
    field: "relatedId",
    label: "相关记录ID",
    component: 'Input',
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

    addNotifications(newData)

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
