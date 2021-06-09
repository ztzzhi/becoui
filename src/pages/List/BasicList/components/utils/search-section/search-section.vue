<template>
  <BeerPanel class="search-section-wrapper">
    <NewBsBox class="row">
      <FormMeta
        v-for="(configItem,j) in formConfig"
        :key="j"
        :class="colClass"
        :config="configItem"
        :model-value="model[configItem.name]"
        @update:modelValue="value=>{
          model[configItem.name] = value
        }"
      />

      <NewBsBox :class="['operation-wrapper', operationClass]">
        <BeerButton @click="handleSearch">{{ submitText }}</BeerButton>
        <BeerButton
          :bs="{mr:'20px'}"
          variant="secondary"
          @click="handleReset"
        >{{ resetText }}</BeerButton>
      </NewBsBox>
    </NewBsBox>
  </BeerPanel>
</template>

<script lang="ts">
  import {
    defineComponent, ref, computed, onMounted, watch,
  } from 'vue'
  import {
    BeerPanel, NewBsBox, BeerButton,
  } from '@xhs/yam-beer'
  import FormMeta from './FormMeta.vue'

  export default defineComponent({
    name: 'SearchSection',
    components: {
      BeerPanel,
      NewBsBox,
      FormMeta,
      BeerButton,
    },
    props: {
      modelValue: {
        type: Object,
      },
      config: {
        type: Object,
      },
      submitText: {
        type: String,
      },
      resetText: {
        type: String,
      },
      handleSearch: {
        type: Function,
      },
      handleReset: {
        type: Function,
      },
    },
    setup(props) {
      const screenWidth = ref(document.body.clientWidth)
      const colClass = ref('col-lg-3')
      const operationClass = ref()
      const rowNum = ref(1)

      onMounted(() => {
        window.onresize = () => {
          screenWidth.value = document.body.clientWidth
        }
      })

      const model = ref(props.modelValue)

      const formConfig = computed(() => props?.config?.children.map((configItem:any) => {
        const {
          name,
          formItem = {},
          component,
        } = configItem

        return {
          name,
          formItem,
          component: {
            ...component,
            is: component?.is ? component.is : 'BeerInput',
            props: {
              ...component?.props,
              bs: { width: '100%', ...component?.props?.bs },
            },
          },
        }
      }))

      watch(() => screenWidth.value, nv => {
        if (nv <= 1200) {
          colClass.value = 'col-xs-6'
          rowNum.value = Math.ceil((formConfig.value.length + 1) / 2)
        } else if (nv > 1200 && nv <= 1440) {
          colClass.value = 'col-sm-4'
          rowNum.value = Math.ceil((formConfig.value.length + 1) / 3)
        } else if (nv > 1440 && nv <= 1920) {
          colClass.value = 'col-md-3'
          rowNum.value = Math.ceil((formConfig.value.length + 1) / 4)
        } else if (nv > 1920) {
          colClass.value = 'col-lg-3'
          rowNum.value = Math.ceil((formConfig.value.length + 1) / 4)
        }
      }, { immediate: true })

      watch(() => rowNum.value, nv => {
        if (nv >= 2) {
          operationClass.value = 'operation-wrapper-end'
        } else {
          operationClass.value = 'operation-wrapper-start'
        }
      }, { immediate: true })

      return {
        model,
        formConfig,
        colClass,
        rowNum,
        operationClass,
      }
    },
  })
</script>

<style lang="stylus" scoped>
@import './grid.styl'

.search-section-wrapper{
  padding 20px 0 0 20px
  margin 0 0 20px 0

  :deep(.css-1ee0j8m){
    min-width 90px
    .css-1t8wpoj{
      justify-content flex-end
      padding-right 10px
    }
  }
  :deep(.css-hshm0p){
    flex 1
  }
}

.operation-wrapper-start{
  justify-content flex-start
}
.operation-wrapper-end{
  justify-content flex-end
}
.operation-wrapper{
  display flex
  flex 1
  padding-bottom 20px
}
</style>
