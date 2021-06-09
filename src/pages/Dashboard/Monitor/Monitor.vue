<template>
  <div class="wrapper">
    <BecoPageDashboard
      :cards-info="schema.cardsInfo"
      :charts-info="schema.chartsInfo"
    >
      <template #cardsInfo-footer>
        想快速提升浏览量？<span
          style="color:#3A64FF; cursor:pointer"
          @click="handleClickFooter"
        >点击进行广告投放</span>
      </template>
    </BecoPageDashboard>
  </div>
</template>

<script lang="ts">
  import { toaster } from '@xhs/yam-beer'
  import { defineComponent, computed, ref } from 'vue'
  import BecoPageDashboard from './components/beco-page-dashboard.vue'

  export default defineComponent({
    name: 'Mointor',
    components: {
      BecoPageDashboard,
    },
    setup() {
      // mock 图表数据刷新
      const pieData = ref([
        { value: 10083877, name: '男性' },
        { value: 19302123, name: '女性' },
      ])
      const graphicText = ref(`${(29386000).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')}`)

      setTimeout(() => {
        pieData.value = [
          { value: 9013877, name: '男性' },
          { value: 19302123, name: '女性' },
        ]
        graphicText.value = `${(28316000).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')}`
      }, 3000)

      const handleClickFooter = () => {
        toaster.notify('可自行实现逻辑')
      }

      const schema = {
        cardsInfo: computed(() => ({
          title: '实时总览',
          subtitle: '更新时间：2021-03-23  11:09:12',
          slots: {

          },
          layout: {
            columnNum: 6,
          },
          list: [
            {
              title: '浏览量',
              data: 983000,
              compareText: '昨日：',
              compareLeftNum: 20000,
            },
            {
              title: '交易金额',
              icon: 'exclamation-marks-b',
              data: 21186000,
              compareText: '昨日：',
              compareLeftNum: 312000,
            },
            {
              title: '实付金额',
              icon: 'exclamation-marks-b',
              tipText: '实付金额tooptip',
              data: 982000,
              compareText: '昨日：',
              compareLeftNum: 987000,
            },
            {
              title: '交易买家数',
              icon: 'exclamation-marks-b',
              tipText: '交易买家数tooptip',
              data: 6021,
              compareText: '昨日：',
              compareLeftNum: 6156,
            },
            {
              title: '交易转化率',
              icon: 'exclamation-marks-b',
              tipText: '交易转化率tooptip',
              data: 0.76,
              compareText: '昨日：',
              compareLeftNum: 0.68,
            },
            {
              title: '访客数',
              icon: 'exclamation-marks-b',
              tipText: '访客数tooptip',
              data: 100761,
              compareText: '昨日：',
              compareLeftNum: 98260,
            },
          ],
        })),
        chartsInfo: computed(() => ({
          title: '实时趋势',
          layout: {
            columnNum: 2,
          },
          options: [
            {
              type: 'pie',
              title: {
                text: '性别',
              },
              graphic: [
                {
                  type: 'text',
                  left: 'center',
                  top: '40%',
                  style: {
                    text: graphicText.value,
                    fontWeight: 800,
                    fontSize: 22,
                    fontFamily: 'Avenir',
                  },
                },
                {
                  type: 'text',
                  left: 'center',
                  top: '52%',
                  style: {
                    text: '总人数',
                    fill: '#888',
                    fontSize: 12,
                  },
                },
              ],
              series: [
                {
                  data: pieData.value,
                  label: {
                    padding: 16,
                    border: '0px 8px 8px red',
                    borderColor: 'rgba(50, 50, 71, 0.08)',
                    borderRadius: [0, 0, 8, 8],
                    shadowColor: 'rgba(50, 50, 71, 0.06)',
                    shadowBlur: [0, 0, 8, 16],
                    borderWidth: 1,
                    formatter: (item:any) => {
                      const { data: { value, name } } = item
                      return `{nameClass|${name}}\n{valueClass|${value.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')}}`
                    },
                    rich: {
                      nameClass: {
                        color: 'rgba(60, 60, 67, 0.6)',
                      },
                      valueClass: {
                        color: '#11263C',
                        fontSize: 18,
                        fontWeight: 800,
                        fontFamily: 'Avenir',
                        height: 28,
                        lineHeight: 28,
                      },
                    },
                  },
                },
              ],
            },
            {
              type: 'bar',
              title: {
                text: '用户消费水平',
              },
              xAxis: {
                data: ['0-10000', '10000-20000', '20000-30000', '30000-40000', '40000-50000'],
              },
              yAxis: {},
              series: [
                {
                  data: [0.3, 0.9, 0.6, 0.55, 0.8],
                },
              ],
            },
            {
              type: 'line',
              title: {
                text: '交易金额',
              },
              xAxis: {
                data: ['8:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'],
              },
              series: [
                {
                  name: '今日',
                  data: [150, 230, 224, 218, 135, 147, 260],
                },
                {
                  name: '昨日',
                  data: [15, 23, 224, 28, 135, 17, 260],
                },
              ],
            },
            {
              type: 'custom',
              title: {
                text: '地域分布',
              },
              xAxis: {
                data: ['上海', '武汉', '广州', '西安', '兰州'],
              },
              series: [
                {
                  name: '日活',
                  type: 'bar',
                  barWidth: 12,
                  itemStyle: {
                    color: '#3A64FF',
                    borderRadius: [100, 100, 0, 0],
                  },
                  data: [0.3, 0.9, 0.6, 0.55, 0.8],
                },
                {
                  name: '月活',
                  type: 'bar',
                  barWidth: 12,
                  itemStyle: {
                    color: '#FF778A',
                    borderRadius: [100, 100, 0, 0],
                  },
                  data: [0.25, 0.85, 0.55, 0.5, 0.8],
                },
                {
                  name: '昨日',
                  data: [0.5, 0.8, 0.4, 0.65, 0.9],
                  type: 'line',
                  smooth: true,
                },
              ],
            },
          ],
        })),
      }

      return {
        handleClickFooter,
        schema,
      }
    },
  })
</script>

<style lang="stylus" scoped>
.wrapper{
  margin 20px
}
</style>
