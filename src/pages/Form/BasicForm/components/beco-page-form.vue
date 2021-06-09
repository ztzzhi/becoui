<template>
  <NewBsBox class="beco-page-form-wrapper">
    <!-- 面包屑区域 -->
    <Breadcrumb
      v-if="navList.length"
      :nav-list="navList"
      :bs="{mb:20}"
    />

    <!-- 表单项区域 -->
    <BeerPanel
      v-for="(section, i) in standardConfig"
      :key="i"
      class="section-panel"
    >
      <NewBsBox>
        <NewBsBox
          v-if="section.title"
          class="section-title"
        >
          {{ section.title }}
        </NewBsBox>
        <FormCollection
          v-model="model"
          :config="section.config"
        />

        <!-- 基础表单操作区域 -->
        <NewBsBox
          v-if="standardConfig.length<=1"
          :bs="{ml:'150px'}"
        >
          <slot name="submit-button">
            <BeerButton
              :disabled="isSubmitting"
              type="primary"
              variant="default"
              @click="handleSubmit"
            >
              {{ submitText }}
            </BeerButton>
          </slot>

          <slot name="reset-button">
            <BeerButton
              type="secondary"
              variant="secondary"
              @click="handleReset"
            >
              {{ resetText }}
            </BeerButton>
          </slot>
        </NewBsBox>
      </NewBsBox>
    </BeerPanel>

    <!-- 高级表单操作区域 -->
    <BeerPanel
      v-if="standardConfig.length>1"
      class="operation-wrap"
    >
      <slot name="submit-button">
        <BeerButton
          :disabled="isSubmitting"
          type="primary"
          variant="default"
          @click="handleSubmit"
        >
          {{ submitText }}
        </BeerButton>
      </slot>

      <slot name="reset-button">
        <BeerButton
          type="secondary"
          variant="secondary"
          @click="handleReset"
        >
          {{ resetText }}
        </BeerButton>
      </slot>
    </BeerPanel>
  </NewBsbox>
</template>

<script>
  import {
    defineComponent, ref, computed, provide, toRaw, shallowRef, watch,
  } from 'vue'
  import {
    NewBsBox, BeerButton, BeerPanel, Breadcrumb,
  } from '@xhs/yam-beer'
  import { cloneDeep, isEqual } from 'lodash'
  import IBecoPageFormProps from './utils/page-form.props'
  import FormCollection from './utils/FormCollection.vue'

  export default defineComponent({
    name: 'BecoPageForm',
    components: {
      NewBsBox,
      BeerButton,
      FormCollection,
      BeerPanel,
      Breadcrumb,
    },
    props: IBecoPageFormProps,
    emits: ['update:modelValue'],
    setup(props, { emit }) {
      // 存取 formItem 实例
      const formItems = []
      provide('formItems', formItems)

      const navList = ref(props.navList || [])
      const submitText = ref(props.formSchema?.submitText || '提交')
      const resetText = ref(props.formSchema?.resetText || '重置')
      const formConfig = shallowRef(props.formSchema.formConfig || [])

      const initValue = cloneDeep(props.modelValue)
      const model = ref(props.modelValue)

      watch(() => props.navList, nv => {
        navList.value = nv || []
      }, { deep: true })

      watch(() => props.modelValue, nv => {
        model.value = nv
      }, { deep: true })

      watch(() => props.formSchema, nv => {
        formConfig.value = nv?.formConfig || []
        resetText.value = nv?.resetText || '重置'
        submitText.value = nv?.submitText || '提交'
      }, { deep: true })

      // 格式化传入的表单配置
      const standardConfig = computed(() => formConfig.value.map(configItem => {
        const cnf = {
          title: configItem.title,
          config: {
            children: [],
          },
        }
        cnf.title = configItem.title
        cnf.config.children = configItem.config?.children.map(child => {
          const {
            name, label, required, requiredMessage, show = true, formItem = {}, component, validation,
          } = child

          const iChild = {
            name,
            label,
            required,
            requiredMessage,
            show,
            ...formItem,
            component: {
              ...component,
              is: component?.is ? component.is : 'Input',
              props: {
                ...component?.props,
                bs: { width: '100%', ...component?.props?.bs },
              },
            },
            validation,
          }

          return iChild
        })

        return cnf
      }))

      const isSubmitting = ref(false)
      const handleSubmit = async () => {
        const validate = () => Promise.all(formItems.map(formItem => formItem.validate()))

        isSubmitting.value = true
        try {
          await validate()
          props.formSchema.submit?.(toRaw(model.value))
        } catch (error) {
          console.log(error)
        }
        isSubmitting.value = false
      }

      const handleReset = () => {
        if (isEqual(initValue, model.value)) {
          return
        }
        emit('update:modelValue', cloneDeep(initValue))
      }

      return {
        navList,
        submitText,
        resetText,
        isSubmitting,
        model,
        standardConfig,
        handleSubmit,
        handleReset,
      }
    },
  })
</script>

<style lang="stylus" scoped>
.beco-page-form-wrapper{
  padding 20px
  :deep(.css-145zvec){
    width 150px
    max-width none
    .css-1t8wpoj{
      justify-content flex-end
    }
  }
  :deep(.css-hshm0p){
    width 445px
  }

  .section-panel{
    padding 20px
    margin-top 0

    .section-title{
      line-height 16px
      font-weight 700
      font-size 16px
      margin-bottom 24px
      padding 8px 0
    }

    .section-form-meta{
      :deep(.css-hshm0p){
        padding-bottom 24px
      }

      &:last-child{
        :deep(.css-hshm0p){
          padding-bottom 0
        }
      }
    }
  }

  .operation-wrap{
    display flex
    justify-content center
    flex-direction row
    margin 0
    padding 20px 0
    position sticky
    bottom 0
  }
}
</style>
