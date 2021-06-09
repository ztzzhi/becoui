<template>
  <FormGroup
    :label="config.formItem.label"
    :label-tooltip="config.formItem.tooltip ? { content: config.formItem.tooltip } : undefined"
  >
    <component
      :is="getInput(config.component)"
      v-model="model"
      v-bind="config.component.props"
    />
  </FormGroup>
</template>

<script lang="ts">
  import {
    defineComponent, ref, watch,
  } from 'vue'
  import {
    FormGroup,
    BeerInput,
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

  const components = {
    BeerInput,
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
    name: 'FormMeta',
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
      const model = ref(props.modelValue)

      const capitalize = (str:string) => `${str?.slice(0, 1).toUpperCase()}${str.slice(1)}`
      const isVueComponent = (component:any) => typeof component?.render === 'function' || !!component?.mixins

      const getInput = (input:any) => {
        if (isVueComponent(input.is)) {
          return input.is
        }
        // @ts-ignore
        return components[input?.is] ?? components[capitalize(input?.is)]
      }

      watch(() => model.value, async nv => {
        emit('update:modelValue', nv)
      }, { deep: true })

      watch(() => props.modelValue, nv => {
        model.value = nv
      }, { deep: true })

      return {
        getInput,
        model,
      }
    },
  })
</script>

<style lang="stylus" scoped>

</style>
