<template>
  <NewBsBox :bs="wraperStyle">
    <NewBsBox
      v-for="(card, index) in list"
      :key="index"
      :bs="boxStyle"
    >
      <NewBsBox
        :bs="{
          ...compStyle.body,
          backgroundColor: active === index ? '#F3F6FF' : compStyle.body.backgroundColor,
          border: active === index ? '1px solid #3A64FF' : compStyle.body.border,
          cursor: card.genPath ? 'pointer' : 'default'
        }"
        @click="handleClickCard(card, index)"
      >
        <NewBsBox
          v-if="card.title"
          class="card-header"
          :bs="{ fontSize: 12, color: '#888', fontWeight: 500, display: 'flex', alignItems: 'center' }"
        >
          <slot
            name="header"
            :card="card"
            :index="index"
            :data="card.title"
          >
            <NewBsBox
              as="span"
              :bs="{ mr: 5, verticalAlign: 'middle' }"
            >{{ card.title }}</NewBsBox>
            <Tooltip
              :content="card[tooltipContentKey]"
              v-bind="tooltip"
            >
              <BeerIcon
                v-if="card.icon"
                :bs="{ width: 13, height: 13, fill: '#888', verticalAlign: 'middle', cursor: 'pointer' }"
                :icon="card.icon"
              />
            </Tooltip>
          </slot>
        </NewBsBox>
        <NewBsBox :bs="compStyle.main">
          <slot
            :data="card.data"
            :card="card"
            :index="index"
          >
            {{ formatDataFn(card.data, card, index) }}
          </slot>
        </NewBsBox>
        <NewBsBox
          v-if="card.compareText"
          :bs="{ display: 'flex', color: '#888' }"
        >
          <NewBsBox :bs="{ flex: 1, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', fontSize: 12 }">
            <slot
              name="footerLeft"
              :data="card.compareText"
              :card="card"
              :index="index"
            >
              <span>{{ card.compareText }}</span>
              <span v-if="typeof card.compareLeftNum === 'number'">{{ formatDataFn(card.compareLeftNum, card, index) }}</span>
            </slot>
          </NewBsBox>
          <NewBsBox
            v-if="card.compareNum || $slots.footerRight"
            :bs="{ ml: 5,color: formatCompare[index].color, textAlign: 'right' }"
          >
            <slot
              name="footerRight"
              :data="card.compareNum"
              :card="card"
              :index="index"
            >
              <NewBsBox
                as="span"
                :bs="{
                  display: 'inline-block',
                  transform: formatCompare[index].status ? 'none' : 'rotate(180deg)',
                  verticalAlign: 'middle'
                }"
              >
                <BeerIcon
                  :bs="{ width: 13, height: 13, fill: formatCompare[index].color, verticalAlign: 'middle' }"
                  :icon="formatCompare[index].icon"
                />
              </NewBsBox>
              <NewBsBox
                as="span"
                :bs="{ fontWeight: 800, fontSize: 16, ml: 5, verticalAlign: 'middle' }"
              >
                {{ formatCompare[index].num }}
              </NewBsBox>
            </slot>
          </NewBsBox>
        </NewBsBox>
      </NewBsBox>
    </NewBsBox>
  </NewBsBox>
</template>

<script lang="ts">
  import {
    defineComponent, ref, computed, watch,
  } from 'vue'
  import { useRouter, RouteLocationRaw } from 'vue-router'
  import { NewBsBox, BeerIcon, Tooltip } from '@xhs/yam-beer'
  import BecoProCardProps, { CardProps } from './beco-card.props'
  import {
    BASE_LAYOUT, BASE_CARD_STYLE, BASE_DATA_STYLE, DATA_TYPES, formatDataToComma, formatDataToPercent, BASE_CARD_CONFIG, BASE_TOOLTIP_CONFIG,
  } from './config'

  export default defineComponent({
    name: 'ProButton',
    components: {
      NewBsBox,
      BeerIcon,
      Tooltip,
    },
    props: BecoProCardProps,
    setup(props) {
      const router = useRouter()

      const genStyle = ref(props.schema?.genStyle)
      const list = ref(props.schema?.list || [])
      const layout = ref(props.schema?.layout || {})
      const tooltip = ref(props.schema?.tooltip || {})

      watch(() => props.schema, nv => {
        genStyle.value = nv?.genStyle
        list.value = nv?.list || []
        layout.value = nv?.layout || {}
        tooltip.value = nv?.tooltip || {}
      }, { deep: true })

      list.value = list.value.map(card => ({ ...BASE_CARD_CONFIG, ...card }))

      tooltip.value = { ...BASE_TOOLTIP_CONFIG, ...tooltip.value }
      const tooltipContentKey = tooltip.value.is
      delete tooltip.value.is

      const layoutConfig = { ...BASE_LAYOUT, ...layout.value }
      const wraperStyle = computed(() => {
        const iswrap = list.value.length > layoutConfig.columnNum
        return {
          display: 'flex',
          m: `0 -${layoutConfig.gap / 2}px`,
          flexWrap: iswrap ? 'wrap' : 'nowrap',
        }
      })

      const boxStyle = computed(() => {
        const width = `${100 / layoutConfig.columnNum}%`
        const gap = layoutConfig.gap / 2
        return {
          width,
          p: gap,
        }
      })

      const compStyle = computed(() => {
        const style = genStyle?.value?.() || {}
        return {
          body: {
            ...BASE_CARD_STYLE,
            ...style,
          },
          main: BASE_DATA_STYLE,
        }
      })

      // 格式化数据的方式
      const formatCompare = computed(() => list.value.map(card => {
        const { compareNum = 0 } = card
        const succ = compareNum >= 0

        return {
          status: succ,
          color: succ ? '#FF2442' : '#42C9A0',
          icon: 'guidance-f',
          num: `${(Math.abs(compareNum) * 100).toFixed(2)}%`,
        }
      }))

      // 点击每一个card
      const active = ref(-1)
      const handleClickCard = (card: CardProps, index: number) => {
        console.log(index)
        // active.value = index
        if (typeof card.genPath === 'function') {
          const routeConfig: RouteLocationRaw = card.genPath(card)
          router.push(routeConfig)
        }
      }

      const formatDataFn = (num: number, card: CardProps, index: number) => {
        const { dataType: type, formatData } = card
        if (type === DATA_TYPES.COMMA) {
          return formatDataToComma(num)
        } if (type === DATA_TYPES.PERCENT) {
          return formatDataToPercent(num)
        } if (type === DATA_TYPES.CUSTOM) {
          if (typeof formatData !== 'function') throw new TypeError('[beco-ui]:formatData type is Function')
          return formatData(card, index) ?? num
        }
        return num
      }

      return {
        wraperStyle,
        compStyle,
        list,
        boxStyle,
        layoutConfig,
        formatCompare,
        handleClickCard,
        active,
        formatDataFn,
        tooltip,
        tooltipContentKey,
      }
    },
  })
</script>

<style lang="stylus" scoped>
.card-header >>> svg:hover {
  fill #3f87f5
}
</style>
