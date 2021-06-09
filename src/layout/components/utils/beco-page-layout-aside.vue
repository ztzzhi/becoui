<template>
  <div
    :class="collapse && 'aside-collapse'"
    class="beco-page-layout-aside"
  >
    <div class="beco-page-layout-aside-logo">
      <slot
        :collapse="menuCollapse"
        name="logo"
      />
    </div>

    <beco-page-layout-menu
      :menu-config="menuConfig"
      :collapse="menuCollapse"
    />
  </div>
</template>

<script lang="ts">
  import { computed, PropType } from 'vue'
  import { INodeType } from './page-layout.props'
  import { useScreenSize } from './composables'
  import BecoPageLayoutMenu from './beco-page-layout-menu.vue'

  export default {
    name: 'BecoPageLayoutAside',
    components: {
      BecoPageLayoutMenu,
    },
    props: {
      collapse: {
        type: Boolean,
        default: true,
      },
      menuConfig: Object as PropType<INodeType[]>,
    },
    setup(props) {
      const size = useScreenSize()
      const menuCollapse = computed(() => (size.value === 'xs' ? false : props.collapse))

      return {
        menuCollapse,
      }
    },
  }
</script>
<style lang="stylus" scoped>
aside-width = 208px
c-aside-background = #fff
t-duration = 0.3s
t-timing-function = ease-out
header-height = 64px
c-border = #edf2f9
blue-base = #3A64FF

.beco-page-layout-aside {
  min-height: 100vh;
  // border-right: 1px solid c-border;
  width: aside-width;
  background: c-aside-background;
  transition: width t-duration t-timing-function;

  &.aside-collapse {
    width: 60px;
  }

  &-logo {
    display: flex;
    align-items: center;
    justify-content: center;
    height: header-height;
    border-bottom: 1px solid c-border;
    background: c-aside-background;
    overflow: hidden;
    cursor: pointer;
  }

  .beco-page-layout-menu {
    margin: 0;
    padding: 0;
    list-style: none;
    color: #53535f;
    font-size: 14px;

    &-item {
      white-space: nowrap;
      cursor: pointer;
      padding: 10px 15px;
      position: relative;
      overflow: hidden;
      padding-left: 24px;

      &:hover {
        color: blue-base;
      }

      &-active {
        border-right: 2px solid blue-base;
        color: blue-base;
      }

      &-center {
        text-align: center;
      }

      &-title {
        padding-left: 10px;
        user-select: none;
      }
    }
  }
}
</style>
