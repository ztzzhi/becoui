<script lang="tsx">
  import {
    defineComponent, ref, watch, inject,
  } from 'vue'
  import { NewBsBox } from '@xhs/yam-beer'
  import FormItem from './FormItem.vue'

  export default defineComponent({
    name: 'FormCollection',
    props: {
      modelValue: {
        type: Object,
      },
      config: {
        type: Object,
        required: true,
      },
    },
    setup(props) {
      const formItems = inject('formItems') as any[]
      const model = ref(props.modelValue)

      watch(() => props.modelValue, nv => {
        model.value = nv
      }, { deep: true })

      const showChild = (show:(model:any)=>boolean|boolean) => {
        if (typeof show === 'function') {
          return show(model)
        }
        return show
      }

      const renderObject = (children = []) => children.map((child:any, i) => {
        const {
          name, show, component,
        } = child

        if (!showChild(show)) {
          // 这里更新 formItems
          const index = formItems.findIndex((item:any) => item.config.name === child.name)
          if (index > -1) {
            formItems.splice(index, 1)
          }

          return undefined
        }

        const onInput = (v:any) => {
          if (model.value) {
            model.value[name] = v
          }
        }
        if (component) {
          return (
            <FormItem
              key={i}
              config={child}
              modelValue={model.value?.[name]}
              // @ts-ignore
              onUpdate:modelValue={onInput}
            />
          )
        }

        return undefined

        //   return (
        //       <FormCollection
        //         key={i}
        //         config={child}
        //         value={this.model[name]}
        //         onInput={v => {
        //           this.model[name] = v
        //         }}
        //       />
        //     )
      })

      return () => (
          <NewBsBox class="form-collection">{renderObject(props.config.children)}</NewBsBox>
        )
    },
  })
</script>
