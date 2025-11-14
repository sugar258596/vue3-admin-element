import {
  ElCascader,
  ElCheckboxGroup,
  ElColorPicker,
  ElDatePicker,
  ElInput,
  ElInputTag,
  ElInputNumber,
  ElRadioGroup,
  ElRate,
  ElSelect,
  ElSelectV2,
  ElSlider,
  ElSwitch,
  ElTimePicker,
  ElTimeSelect,
  ElTransfer,
  ElAutocomplete,
  ElDivider,
  ElTreeSelect,
  ElUpload
} from 'element-plus'
import { InputPassword } from '@/components/InputPassword'
import { Editor } from '@/components/Editor'
import { JsonEditor } from '@/components/JsonEditor'
import { IconPicker } from '@/components/IconPicker'
import { IAgree } from '@/components/IAgree'

const componentMap = {
  RadioGroup: ElRadioGroup,
  RadioButton: ElRadioGroup,
  CheckboxGroup: ElCheckboxGroup,
  CheckboxButton: ElCheckboxGroup,
  Input: ElInput,
  InputTag: ElInputTag,
  Autocomplete: ElAutocomplete,
  InputNumber: ElInputNumber,
  Select: ElSelect,
  Cascader: ElCascader,
  Switch: ElSwitch,
  Slider: ElSlider,
  TimePicker: ElTimePicker,
  DatePicker: ElDatePicker,
  Rate: ElRate,
  ColorPicker: ElColorPicker,
  Transfer: ElTransfer,
  Divider: ElDivider,
  TimeSelect: ElTimeSelect,
  SelectV2: ElSelectV2,
  InputPassword: InputPassword,
  Editor: Editor,
  TreeSelect: ElTreeSelect,
  Upload: ElUpload,
  JsonEditor: JsonEditor,
  IconPicker: IconPicker,
  IAgree: IAgree
}

export { componentMap }
