import { PropType } from 'vue'

export type ILayout = {
  columnNum: number
}

export type IBecoProChartsProps = {
  options: any
  layout?: ILayout
}

export default {
  schema: Object as PropType<IBecoProChartsProps>,
}
