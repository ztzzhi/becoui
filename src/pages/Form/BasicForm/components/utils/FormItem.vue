<template>
  <FormGroup
    :label-bs="config.labelBs"
    :label="config.label"
    :required="config.required"
    :layout="config.isHorizontal ? 'table' : undefined"
    :error-text="validationMessage ? validationMessage : undefined"
    :label-info="config.comment"
    :helper-text="config.helperText"
    :label-tooltip="config.tooltip ? { content: config.tooltip } : undefined"
  >
    <component
      :is="getInput(config.component)"
      v-if="config.type === 'number'"
      v-model.number="model"
      v-bind="config.component.props"
    />
    <component
      :is="getInput(config.component)"
      v-else-if="config.type === 'string'"
      v-model.trim="model"
      v-bind="config.component.props"
    />
    <component
      :is="getInput(config.component)"
      v-else
      v-model="model"
      v-bind="config.component.props"
    />
  </FormGroup>
</template>

<script lang="ts">
  import {
    defineComponent, ref, watch, computed, inject, getCurrentInstance, onMounted,
  } from 'vue'
  import {
    isEqual,
  } from 'lodash'
  import {
    FormGroup,
    BeerInput as Input,
    InputWithUnit,
    RangeInput,
    ComboInput,
    BeerTextArea as TextArea,
    RadioGroup,
    BeerCheckbox as Checkbox,
    BeerSwitch as Switch,
    SingleSelect,
    MultiSelect,
    CascadeSelect,
    MultiCascadeSelect,
    BeerSingleDatePicker as SingleDatePicker,
    BeerMultiDatePicker as MultiDatePicker,
    BeerDateRangePicker as DateRangePicker,
    BeerClockSelect as ClockSelect,
    BeerFileUploader as FileUploader,
    ImageUploader,
  } from '@xhs/yam-beer'

  import { stdValidations, getComponent } from './utils'

  const components = {
    Input,
    InputWithUnit,
    RangeInput,
    ComboInput,
    TextArea,
    RadioGroup,
    Checkbox,
    Switch,
    SingleSelect,
    MultiSelect,
    CascadeSelect,
    MultiCascadeSelect,
    SingleDatePicker,
    MultiDatePicker,
    DateRangePicker,
    ClockSelect,
    ImageUploader,
    FileUploader,
  }

  export default defineComponent({
    name: 'FormItem',
    components: {
      FormGroup,
    },
    props: {
      modelValue: [String, Number, Boolean, Array, Object],
      config: {
        type: Object,
        required: true,
      },
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
      const formItems = inject('formItems') as any[]
      const { proxy } = getCurrentInstance() as any

      onMounted(() => {
        if (formItems.findIndex(item => item.config.name === props.config.name) < 0) {
          formItems.push(proxy)
        }
      })

      const model = ref(props.modelValue)
      const updatedValidationMessage = ref('')
      const isValid = ref(true)

      const getInput = (input:any) => getComponent(input.is, components)

      const validate = async () => {
        const {
          required, requiredMessage, type, validation,
        } = props.config

        const validations = stdValidations({
          required,
          requiredMessage,
          type,
          validation,
        })

        if (validations.length === 0) {
          return
        }

        try {
          const validationPromises = validations.map(validateItem => validateItem(model.value))
          const result = await Promise.all(validationPromises)
          const [{ validatedValue }] = result as any

          // 验证的 value 并非当前 value，放弃该次验证结果
          if (isValid.value && !isEqual(validatedValue, props.modelValue)) {
            return
          }

          isValid.value = true
        } catch ({ validatedValue, validationMessage }) {
          isValid.value = false

          if (validationMessage) {
            updatedValidationMessage.value = validationMessage
          }

          throw validationMessage
        }
      }

      watch(() => model.value, async nv => {
        emit('update:modelValue', nv)

        try {
          await validate()
        } catch (err) {
          if (err instanceof Error) {
            throw err
          }
        }
      }, { deep: true })

      watch(() => props.modelValue, nv => {
        model.value = nv
      }, { deep: true })

      const validationMessage = computed(() => (!isValid.value ? updatedValidationMessage.value : undefined))

      return {
        validate,
        getInput,
        model,
        validationMessage,
      }
    },
  })
</script>

<style lang="stylus" scoped></style>
