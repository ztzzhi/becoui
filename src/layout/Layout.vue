<template>
  <beco-page-layout :menu-config="menuConfig">
    <!--    <template #logo="{ collapse }">-->
    <!--      <p>{{ collapse ? 'A' : 'Ark' }}</p>-->
    <!--    </template>-->
    <template #left-header>
      <NewBsBox class="left-header">
        <BeerTooltip
          placement="right"
          content="点击可以查看页面配置代码"
        >
          <BeerButton
            variant="text"
            size="s"
            :bs="{m:0, p:0, minWidth:0}"
            @click="handleShowSourceCode"
          >页面配置</BeerButton>
        </BeerTooltip>
      </NewBsBox>
    </template>
    <template #right-header>
      <NewBsBox class="avatar">
        <img src="https://fe-img-qc.xhscdn.com/559215fe936e5294d1d9af18f29290f664825b84">
      </NewBsBox>
    </template>
  </beco-page-layout>
</template>

<script lang="ts">
  import { useRoute } from 'vue-router'
  import { defineComponent, watch, ref } from 'vue'
  import { NewBsBox, BeerButton, BeerTooltip } from '@xhs/yam-beer'
  import BecoPageLayout from './components/beco-page-layout.vue'

  export default defineComponent({
    name: 'Layout',
    components: {
      NewBsBox,
      BeerTooltip,
      BeerButton,
      BecoPageLayout,
    },
    setup() {
      const menuConfig = [
        {
          id: 1,
          text: 'Dashboard',
          icon: 'sort',
          children: [
            {
              id: '1-1',
              text: '实时监控',
              path: '/dashboard/monitor',
            },
          ],
        },
        {
          id: 2,
          text: '列表页',
          icon: 'offline-entities',
          children: [
            {
              id: '2-1',
              text: '查询表格',
              path: '/list/basic-list',
            },
            // {
            //   id: '2-2',
            //   text: '标准列表',
            //   path: '/list/normal-list',
            // },
          ],
        },
        {
          id: 3,
          text: '表单页',
          icon: 'sort',
          children: [
            {
              id: '3-1',
              text: '基础表单',
              path: '/form/basic-form',
            },
            {
              id: '3-2',
              text: '高级表单',
              path: '/form/advanced-form',
            },
          ],
        },
      ]

      // 查看页面配置源码
      const route = useRoute()
      const routePath = ref('')
      watch(() => route.path, nv => {
        routePath.value = nv
      }, {
        immediate: true,
      })

      const sourceCodeMap:{[key: string]: string} = {
        '/dashboard/monitor': 'https://code.devops.xiaohongshu.com/fe/becoui/-/blob/master/src/pages/Dashboard/Monitor/Monitor.vue',
        '/list/basic-list': 'https://code.devops.xiaohongshu.com/fe/becoui/-/blob/master/src/pages/List/BasicList/BasicList.vue',
        '/form/basic-form': 'https://code.devops.xiaohongshu.com/fe/becoui/-/blob/master/src/pages/Form/BasicForm/basic-form.vue',
        '/form/advanced-form': 'https://code.devops.xiaohongshu.com/fe/becoui/-/blob/master/src/pages/Form/AdvancedForm/advanced-form.vue',
      }
      const handleShowSourceCode = () => {
        window.open(sourceCodeMap[routePath.value], '_blank')
      }

      return {
        menuConfig,
        handleShowSourceCode,
      }
    },
  })
</script>

<style lang="stylus" scoped>
.left-header {
  margin-left 10px
}

.avatar > img {
  width 40px
  height 40px
  border-radius 50%
  margin-right 10px
  // cursor pointer
}
</style>
