import { PropType } from 'vue'

export interface INodeType {
  id: string | number
  text: string
  icon?: string
  path?: string
  children?: INodeType[]
}

export default {
  /**
   * 项目名称，默认 beco-ui
   */
  title: {
    type: String,
    default: 'beco-ui',
  },

  /**
   * 自定义生成侧边菜单栏的路由
   */
  menuConfig: {
    type: Object as PropType<INodeType[]>,
  },
}
