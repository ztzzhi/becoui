import { PropType } from 'vue'
import { RouteLocationRaw } from 'vue-router'

export type GenStyle = () => any

export type LayoutProps = {
  columnNum?: number
  gap?: number
}

export type CardProps = {
  title?: string
  icon?: string
  tipText?: string
  data: number
  dataType?: string
  compareText?: string
  compareLeftNum?: number
  compareNum?: number
  formatData?: (card: CardProps, index: number) => any
  genPath?: (card: CardProps) => RouteLocationRaw
}

export type TooltipProps = {
  is?: string
  [k: string]: any
}

export type IBecoProCardProps = {
  genStyle?: GenStyle
  layout?: LayoutProps
  list: CardProps[]
  tooltip?: TooltipProps
}

export default {
  schema: Object as PropType<IBecoProCardProps>,
}
