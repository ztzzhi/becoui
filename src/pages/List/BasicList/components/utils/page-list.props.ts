import { PropType, Ref } from 'vue'

/**
 * 数据筛选区
 */
export type IFilterConfig = {
  submitText?:string
  resetText?: string
  formConfig: any
}

/**
 * 抽象的列表项操作类型
 * link: 点击之后跳转到其他页面处理，如跳转查看
 * confirm: 点击之后二次弹框确认，如删除、下线、上线
 * list: 点击之后当前页面弹窗展示内容，如当前页查看
 * form: 点击之后当前页面弹窗展示表单内容，如编辑
 * custom: 自定义类型
 */
export enum ACTION_TYPE {
  link = 'link',
  confirm ='confirm',
  list ='list',
  form = 'form',
  custom = 'custom',
}

/**
 * 列表功能操作区
 */
export type IToolbarItem = {
  type: keyof typeof ACTION_TYPE
  label?: string
  confirmText?: string
  cancelText?: string
  description?: string
  tooltip?: string
  genPath?:()=>any
  genStyle?: ()=>any
  genInitData?: (data?:any)=>any
  callback?: (formData?:any)=>any
  validation?:(formData?:any)=>Promise<any>
  modalConfig?: (formData:any, extraConfig?:any)=>Ref<any>
}
export type IToolbarConfig = {
  actions?: IToolbarItem[]
  settings?: IToolbarItem[]
}

/**
 * table区
 */
export type IListActionItem = {
  type: keyof typeof ACTION_TYPE
  label?: string
  show?: boolean
  confirmText?: string
  cancelText?: string
  genPath?:(rowData:any)=>any
  genStyle?: ()=>any
  genInitData?:(rowData:any)=>any
  description?: string
  modalConfig?:(formData:any, extraConfig?:any)=>Ref<any>
  callback?: (data?:any)=>Promise<any>
}
export type IListConfig = {
  request: (payload?:any)=>Promise<any>
  postData?: (res: any)=>any
  columns: any[]
  actions?: (rowData:any)=> IListActionItem[]
}

/**
 * 翻页区
 */
export type IPagation = {
  total?: number
  pageNo?: number
  pageSize?: number
}
export type IPaginationConfig = {
  showPager?:boolean
  pagination?: IPagation
  sizeList?: number[]
}

export default {
  filterConfig: Object as PropType<IFilterConfig>,
  toolbarConfig: Object as PropType<IToolbarConfig>,
  listConfig: Object as PropType<IListConfig>,
  paginationConfig: Object as PropType<IPaginationConfig>,
}
