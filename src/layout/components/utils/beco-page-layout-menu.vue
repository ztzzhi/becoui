<template>
  <BeerMenu
    :active-id="activeId"
    :list="menuConfig"
    :handle-click="handleClick"
    :mutual-exclude="true"
    class="beco-page-layout-menu"
  />
</template>

<script lang="ts">
  import {
    defineComponent, PropType, ref, watch,
  } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { BeerMenu } from '@xhs/yam-beer'
  import { INodeType } from './page-layout.props'

  export default defineComponent({
    name: 'BecoPageLayoutMenu',
    components: {
      BeerMenu,
    },
    props: {
      menuConfig: Object as PropType<INodeType[]>,
      collapse: {
        type: Boolean,
        default: false,
      },
    },
    setup(props) {
      const route = useRoute()
      const router = useRouter()

      const activeId = ref('')
      const flatMenuConfig: { id: any; path: any }[] = []
      let matchMenuItem = []

      // 扁平化处理
      const recursiveFlat = (nodes: INodeType[] | any) => {
        if (!nodes || nodes.length === 0) return []
        nodes.forEach((node:any) => {
          flatMenuConfig.push({ id: node.id, path: node.path })
          return recursiveFlat(node.children)
        })
        return []
      }
      recursiveFlat(props.menuConfig)

      // 菜单栏高亮选中
      const selectMenuItem = () => {
        matchMenuItem = flatMenuConfig.filter(menuItem => menuItem.path === route.path)
        if (matchMenuItem?.length) {
          activeId.value = matchMenuItem[0].id
        }
      }

      watch(() => route.path, () => {
        selectMenuItem()
      }, { immediate: true })

      // 菜单切换
      const handleClick = (params: any) => {
        if (params.node.path) {
          router.push(params.node.path)
        }
      }

      return {
        handleClick,
        activeId,
      }
    },
  })
</script>

<style lang="stylus" scoped>
header-height = 64px

.beco-page-layout-menu {
  height auto
  max-height 'calc(100vh - %s)' % header-height;
  width auto
  user-select none
  border-radius 0
}
</style>
