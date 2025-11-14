<script setup>
import { Form, } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { reactive, watch } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'

const { required } = useValidator()

const props = defineProps({
  currentRow: {
    type: Object,
    default: () => null
  },
  formSchema: {
    type: Array,
    default: () => []
  }
})

const rules = reactive({
  id: [required()],
  status: [required()]
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
