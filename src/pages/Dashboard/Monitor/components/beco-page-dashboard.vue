<template>
  <NewBsBox class="beco-page-dashboard">
    <BeerPanel class="cards-info">
      <NewBsBox class="cards-info-label">
        <BeerTitle
          v-if="innerCardsInfo.title"
          class="cards-info-label-main"
        >{{ innerCardsInfo.title }}</BeerTitle>
        <NewBsBox
          v-if="innerCardsInfo.subtitle"
          class="cards-info-label-sub"
        >{{ innerCardsInfo.subtitle }}</NewBsBox>
      </NewBsBox>
      <BecoCard :schema="innerCardsInfo" />
      <NewBsBox
        v-if="$slots['cardsInfo-footer']"
        :bs="{color:'#888', fontSize:'12px', mb:'10px'}"
      >
        <slot name="cardsInfo-footer" />
      </NewBsBox>
    </BeerPanel>

    <BeerPanel :bs="{p:'20px', mt:0}">
      <BeerTitle
        v-if="innerChartsInfo.title"
        class="label-main"
      >{{ innerChartsInfo.title }}</BeerTitle>
      <BecoCharts :schema="innerChartsInfo" />
    </BeerPanel>
  </NewBsBox>
</template>

<script lang="ts">
  import {
    defineComponent, watch, ref,
  } from 'vue'
  import { NewBsBox, BeerPanel, BeerTitle } from '@xhs/yam-beer'
  import BecoCard from './utils/beco-card.vue'
  import BecoCharts from './utils/beco-charts.vue'

  export default defineComponent({
    name: 'BecoPageDashboard',
    components: {
      NewBsBox,
      BeerPanel,
      BeerTitle,
      BecoCard,
      BecoCharts,
    },
    props: {
      cardsInfo: {
        type: Object,
      },
      chartsInfo: {
        type: Object,
      },
    },
    setup(props) {
      const innerCardsInfo = ref(props.cardsInfo)
      const innerChartsInfo = ref(props.chartsInfo)

      watch(() => props.cardsInfo, nv => {
        innerCardsInfo.value = nv
      }, { deep: true })

      watch(() => props.chartsInfo, nv => {
        innerChartsInfo.value = nv
      }, { deep: true })

      return {
        innerCardsInfo,
        innerChartsInfo,
      }
    },
  })
</script>

<style lang="stylus" scoped>
.cards-info{
  padding 20px 20px 10px 20px
  margin-top 20px
  margin-bottom 20px
  &-label{
    display flex
    align-items flex-end
    &-sub{
      margin-left 10px
      margin-bottom 5px
      color #888
      font-size 12px
    }
  }
}
</style>
