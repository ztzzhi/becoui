<template>
  <router-view
    v-slot="{ Component, route }"
    class="beco-page-layout-main"
  >
    <keep-alive v-if="route.meta?.keepAlive">
      <component
        :is="Component"
        :key="route.path"
      />
    </keep-alive>
    <component
      :is="Component"
      v-else
      :key="route.path"
    />
  </router-view>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'

  export default defineComponent({
    name: 'BecoPageLayoutMain',
  })
</script>
<style lang="stylus" scoped>
.beco-page-layout-main{
  height auto
  min-height 100%
}
</style>
