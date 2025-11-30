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
    field: 'username',
    label: t('role.roleName'),
    component: 'Input',
    componentProps: {
      disabled: true
    }
  },
  {
    field: 'status',
    label: t('menu.status'),
    component: 'Select',
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
    field: 'Upload',
    component: 'Upload',
    label: `${t('formDemo.userAvatar')}`,
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
  {
    field: 'role',
    label: '用户角色',
    component: 'Select',
    componentProps: {
      options: [
        {
          value: 'super_admin',
          label: "超级管理员"
        },
        {
          value: 'admin',
          label: "管理员"
        },
        {
          value: 'teacher',
          label: "教师"
        },

        {
          value: 'student',
          label: "学生"
        },
      ]
    }
  },
  {
    field: 'nickname',
    label: '用户昵称',
    component: 'Input'
  },
  {
    field: 'phone',
    label: '手机号',
    component: 'Input'
  },
  {
    field: 'email',
    label: '用户邮箱',
    component: 'Input'
  },
  {
    field: 'department',
    label: '所属院系/部门',
    component: 'Input'
  },
  {
    field: 'teachingTags',
    label: '教学标签数组',
    component: 'InputTag'
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
    const { Upload, id, ...newData } = formData

    if (Upload && Upload.length > 0 && Upload[0].raw) {
      newData.avatar = Upload[0].raw
    }

    await editUser(id, newData)
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
