import { PropType, ComputedRef } from 'vue'

export type IFormConfigItem = {
  title: string
  config: any
}

export type IFormSchema<T> = {
  formConfig:ComputedRef<T[]>
  submitText?: string
  resetText?: string
  submit?: (model:any)=>Promise<any>
}

export default {
  navList: Array,
  formSchema: Object as PropType<IFormSchema<IFormConfigItem>>,
  modelValue: Object,
}
