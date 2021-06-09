<template>
  <new-bs-box class="beco-pro-charts">
    <template
      v-for="(option, index) in computedOptions"
      :key="index"
    >
      <new-bs-box :class="computedClass">
        <vue-echarts
          :option="option"
          class="charts"
        />
      </new-bs-box>
    </template>
  </new-bs-box>
</template>

<script lang="ts">
  import {
    defineComponent, ref, watch, computed,
  } from 'vue'
  import { toaster, NewBsBox } from '@xhs/yam-beer'
  import { VueEcharts } from 'vue3-echarts'
  import BecoProChartsProps from './beco-charts.props'

  const DEFAULT_GRID_WITH_LEGEND = {
    left: 30,
    top: 80,
    right: 20,
    bottom: 20,
  }

  const DEFAULT_GRID_WITHOUT_LEGEND = {
    left: 30,
    right: 20,
    bottom: 20,
  }

  const DEFAULT_LEGEND = {
    x: 'left',
    padding: [40, 0, 0, 5],
  }

  export default defineComponent({
    name: 'BecoProCharts',
    components: {
      NewBsBox,
      VueEcharts,
    },
    props: BecoProChartsProps,
    setup(props) {
      const options = ref(props.schema?.options)
      const layout = ref(props.schema?.layout)

      watch(() => props.schema, nv => {
        options.value = nv?.options
        layout.value = nv?.layout
      }, { deep: true })

      const computedClass = ref('')
      if (layout?.value?.columnNum) {
        if ([1, 2].includes(layout.value.columnNum)) {
          computedClass.value = `beco-pro-charts-${layout.value.columnNum}`
        } else {
          return toaster.warning('columnNum只允许配置1或者2', { id: 'setting' })
        }
      } else {
        computedClass.value = 'beco-pro-charts-1'
      }

      const computedOptions = computed(() => options?.value?.map((option:any) => {
        if (option?.legend) {
          option.grid = { ...DEFAULT_GRID_WITH_LEGEND, ...(option.grid || {}) }
          option.legend = { ...DEFAULT_LEGEND, ...option.legend }
        } else {
          option.grid = { ...DEFAULT_GRID_WITHOUT_LEGEND, ...(option.grid || {}) }
        }

        if (option?.title) {
          option.title.textStyle = {
            fontSize: '16px',
          }
        }
        const { type } = option
        if (type === 'bar') {
          const {
            series, xAxis, yAxis, tooltip,
          } = option

          option.xAxis = {
            axisLine: { // 轴线
              show: false,
            },
            axisTick: { // 刻度线
              show: false,
            },
            ...xAxis,
          }
          option.yAxis = {
            splitLine: { // 网格线
              lineStyle: {
                type: 'dashed',
                color: '#F0F0F0',
              },
            },
            ...yAxis,
          }
          option.tooltip = { ...tooltip }

          option.series = series?.map((item:any, index: number) => {
            const colors = ['#3A64FF', '#FF778A']

            const { barWidth, itemStyle } = item
            item.type = type
            item.barWidth = barWidth || 12
            item.itemStyle = {
              color: colors[index],
              borderRadius: [100, 100, 0, 0],
              ...itemStyle,
            }
            return item
          })
        } else if (type === 'pie') {
          const { series } = option

          option.series = series?.map((item:any) => {
            const { itemStyle } = item
            item.type = type
            item.itemStyle = {
              borderRadius: '100%',
              borderColor: '#fff',
              borderWidth: 8,
              borderCap: 'round',
              ...itemStyle,
            }
            item.backgroundColor = '#fff'
            item.radius = ['60%', '80%']
            item.avoidLabelOverlap = false
            item.emphasis = {
              scaleSize: 2,
            }
            item.color = ['#3A64FF', '#FF778A']

            return item
          })
        } else if (type === 'line') {
          const {
            series, xAxis, yAxis, tooltip,
          } = option

          option.xAxis = {
            boundaryGap: false, // 是否留白
            axisLine: { // 轴线
              show: false,
            },
            axisTick: { // 刻度线
              show: false,
            },
            ...xAxis,
          }
          option.yAxis = {
            splitLine: { // 网格线
              lineStyle: {
                type: 'dashed',
                color: '#F0F0F0',
              },
            },
            ...yAxis,
          }
          option.color = ['#3A64FF', '#FF7589', '#10cf97']
          option.tooltip = { ...tooltip }
          option.series = series?.map((item:any) => {
            item.type = type
            item.areaStyle = {}
            item.smooth = true
            item.showSymbol = true
            item.symbolSize = 10
            item.symbol = 'circle'

            return item
          })
        } else if (type === 'custom') {
          const {
            xAxis, yAxis, tooltip,
          } = option

          option.xAxis = {
            axisLine: { // 轴线
              show: false,
            },
            axisTick: { // 刻度线
              show: false,
            },
            ...xAxis,
          }
          option.yAxis = {
            splitLine: { // 网格线
              lineStyle: {
                type: 'dashed',
                color: '#F0F0F0',
              },
            },
            ...yAxis,
          }
          option.tooltip = { ...tooltip }
        }

        return {
          ...option,
        }
      }))

      return {
        computedOptions,
        computedClass,
      }
    },
  })
</script>
<style lang="stylus" scoped>
charts-height = 280px
gap = 20px
innerPadding = 20px
border-radius = 8px

.beco-pro-charts{
  display flex
  flex-wrap wrap
  margin -(gap/2)
}

.beco-pro-charts-1{
  width 100%
  height charts-height
  padding (gap/2)
}

.beco-pro-charts-2{
  display flex
  width (100% / 2)
  height charts-height
  padding (gap/2)
}

.charts{
  width 100%
  height 100%
  background-color #fff
  padding innerPadding 0
  border-radius border-radius
}
</style>
