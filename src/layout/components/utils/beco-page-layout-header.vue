<template>
  <div class="beco-page-layout-header">
    <div v-if="$slots.left">
      <slot name="left" />
    </div>
    <div
      v-else
      class="header-slot"
    >
      <!--      <NewBsBox-->
      <!--        class="header-fold-btn"-->
      <!--        @click="$emit('toggle-collapse')"-->
      <!--      >-->
      <!--        <svg-->
      <!--          v-if="collapse"-->
      <!--          xmlns="http://www.w3.org/2000/svg"-->
      <!--        >-->
      <!--          <path-->
      <!--            d="M2 2h12M7 10h7M7 6h7"-->
      <!--            stroke-linecap="round"-->
      <!--          />-->
      <!--          <path-->
      <!--            d="M4.667 8L2 5.333v5.334L4.667 8z"-->
      <!--            stroke-linecap="round"-->
      <!--            stroke-linejoin="round"-->
      <!--          />-->
      <!--          <path-->
      <!--            d="M2 14h12"-->
      <!--            stroke-linecap="round"-->
      <!--          />-->
      <!--        </svg>-->
      <!--        <svg-->
      <!--          v-else-->
      <!--          xmlns="http://www.w3.org/2000/svg"-->
      <!--        >-->
      <!--          <path-->
      <!--            d="M2 2h12M8 10h6M8 6h6"-->
      <!--            stroke-linecap="round"-->
      <!--          />-->
      <!--          <path-->
      <!--            d="M2 8l2.667-2.667v5.334L2 8z"-->
      <!--            stroke-linecap="round"-->
      <!--            stroke-linejoin="round"-->
      <!--          />-->
      <!--          <path-->
      <!--            d="M2 14h12"-->
      <!--            stroke-linecap="round"-->
      <!--          />-->
      <!--        </svg>-->
      <!--      </NewBsBox>-->
    </div>
    <div class="header-slot">
      <slot name="right" />
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'

  export default defineComponent({
    name: 'BecoPageLayoutHeader',
    components: {},
    props: {
      collapse: {
        type: Boolean,
        default: false,
      },
    },
    emits: ['toggle-collapse'],
  })
</script>

<style lang="stylus" scoped>
header-height = 64px
c-border = #edf2f9
c-header-background = #fff
blue-base = #3A64FF

.beco-page-layout-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px 0 10px;
  height: header-height;
  border-bottom: 1px solid c-border;
  background: c-header-background;

  .header-slot {
    display: flex;
    align-items: center;

    .header-fold-btn {
      display: inline-flex;
      align-items: center;
      cursor: pointer;
      padding 3px 10px 3px 0
      viewBox 0 0 16 16

      svg {
        width 16px
        height 16px
        fill rgb(204, 204, 204)
        stroke rgb(204, 204, 204)

        &:hover {
          fill blue-base
          stroke blue-base
        }
      }
    }
  }
}
</style>
