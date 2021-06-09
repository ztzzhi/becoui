<template>
  <BecoPageForm
    v-model="formValue"
    :nav-list="schema.navList"
    :form-schema="schema.formSchema"
  />
</template>
<script lang="ts">
  import {
    defineComponent, computed, ref, watch,
  } from 'vue'
  import { toaster, CheckboxGroup } from '@xhs/yam-beer'
  import BecoPageForm from './components/beco-page-form.vue'
  import MyDateRangPicker from '../MyDateRangPicker.vue'

  export default defineComponent({
    name: 'BasicForm',
    components: {
      BecoPageForm,
    },
    setup() {
      const sleep = (msTime:number) => new Promise(resolve => setTimeout(() => {
        resolve(true)
      }, msTime))

      const formValue = ref({
        name: '',
        showTime: { start: '2021-06-09', end: '2021-06-10' },
        contactType: 1,
        address: '',
        businessType: void 0,
        toggle: true,
        type: '',
        ImageUploader: [],
        files: [],
      })

      const typeOptions = ref(['选项A'])
      const getTypeOptions = () => {
        sleep(1000).then(() => {
          typeOptions.value = ['选项B', '选项C']
        })
      }

      watch(() => formValue.value.contactType, nv => {
        formValue.value.type = ''
        if (nv === 3) {
          getTypeOptions()
        } else {
          typeOptions.value = ['选项A']
        }
      })

      const schema = computed(() => ({
        navList: [
          {
            label: '表单页',
            props: {
              bs: {
                backgroundColor: '#eef1f8',
              },
              handleClick: () => toaster.notify('ouch!'),
            },
          },
          {
            label: '基础表单',
          },
        ],
        formSchema: {
          // submitText: 'submit',
          // resetText: 'reset',
          submit: (model:any) => {
            toaster.notify(JSON.stringify(model), { id: 'submit' })
          },
          formConfig: [
            {
              // title: '设置规则',
              config: {
                children: [
                  {
                    name: 'name',
                    label: '联系人',
                    required: true,
                    formItem: {
                      labelBs: {
                        maxWidth: '200px',
                      },
                      isHorizontal: true,
                      tooltip: 'this is tooltip',
                      helperText: '该信息不做公示',
                    },
                    component: {
                      is: 'Input',
                      props: {
                        placeholder: '请输入您的姓名',
                        maxlength: 6,
                      },
                    },
                    validation: ['maxLength', 6],
                    // validation: [
                    //   ['minLength', 4, '不能小于${limit}字符'],
                    //   (value:string) => {
                    //     if (value !== '上海魔都') {
                    //       return Promise.reject('请输入"上海魔都"')
                    //     }
                    //     return Promise.resolve(true)
                    //   },
                    // ],
                  },
                  {
                    name: 'showTime',
                    label: '公示时间',
                    required: true,
                    formItem: {
                      isHorizontal: true,
                    },
                    component: {
                      is: MyDateRangPicker,
                    },
                    validation: (value:any) => {
                      const { start, end } = value

                      if (!start || !end) {
                        return Promise.reject('日期选择不完整')
                      }
                      return Promise.resolve()
                    },
                  },
                  {
                    name: 'contactType',
                    label: '公示联系方式',
                    required: true,
                    requireMessage: '必选项',
                    formItem: {
                      isHorizontal: true,
                    },
                    component: {
                      is: 'RadioGroup',
                      props: {
                        options: [
                          { name: '邮箱', value: 1 },
                          { name: '手机号', value: 2 },
                          { name: '小红书号', value: 3 },
                        ],
                        'onUpdate:modelValue': (value:any) => {
                          console.log('contactType', value)
                        },
                      },
                    },
                  },
                  {
                    name: 'address',
                    label: '详细地址',
                    formItem: {
                      isHorizontal: true,
                    },
                    component: {
                      is: 'TextArea',
                      props: {
                        placeholder: '请按照省市区具体地址的形式进行填写',
                        maxlength: 80,
                      },
                    },
                  },
                  {
                    name: 'businessType',
                    label: '经营类型',
                    required: true,
                    show: formValue.value.contactType !== 3,
                    formItem: {
                      isHorizontal: true,
                    },
                    component: {
                      is: CheckboxGroup,
                      props: {
                        options: [
                          { name: '类型1', value: 1 },
                          { name: '类型2', value: 2 },
                          { name: '类型3', value: 3 },
                        ],
                      },
                    },
                  },
                  {
                    name: 'toggle',
                    label: '开启/关闭',
                    formItem: {
                      isHorizontal: true,
                    },
                    component: {
                      is: 'Switch',
                    },
                  },
                  {
                    name: 'type',
                    label: '选项类型',
                    formItem: {
                      isHorizontal: true,
                    },
                    component: {
                      is: 'SingleSelect',
                      props: {
                        options: typeOptions.value,
                      },
                    },
                  },
                  {
                    name: 'images',
                    label: '身份证照片',
                    formItem: {
                      isHorizontal: true,
                    },
                    component: {
                      is: 'ImageUploader',
                      props: {
                        bucket: 'qimg',
                        bizKey: 'beerdemo',
                        maxFiles: 2,
                      },
                    },
                  },
                  {
                    name: 'files',
                    label: '附件',
                    formItem: {
                      isHorizontal: true,
                    },
                    component: {
                      is: 'FileUploader',
                      props: {
                        bucket: 'picasso',
                        bizKey: 'beerdemo',
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
      }))

      return {
        formValue,
        schema,
      }
    },
  })
</script>

<style lang="stylus" scoped>
.wrapper{
  padding 20px
}
</style>
