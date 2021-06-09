<template>
  <DateRangePicker
    v-model:start="dayRange.start"
    v-model:end="dayRange.end"
  />
</template>

<script lang="ts">
  import { defineComponent, ref, watch } from 'vue'
  import { DateRangePicker } from '@xhs/yam-beer'

  export default defineComponent({
    name: 'MyDateRangPicker',
    components: {
      DateRangePicker,
    },
    props: {
      modelValue: {
        type: Object,
      },
    },
    setup(props) {
      const dayRange = ref(props.modelValue)

      watch(() => props.modelValue, nv => {
        dayRange.value = nv
      }, { deep: true })

      return {
        dayRange,
      }
    },
  })
</script>
