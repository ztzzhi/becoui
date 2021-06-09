import { Ref, toRefs } from 'vue'

/**
 * 数据筛选区
 */
export const useFilter = (filterConfig: Ref) => ({
  ...toRefs(
    {
      submitText: '搜索',
      resetText: '重置',
      ...filterConfig?.value,
    },
  ),
})

/**
 * 列表功能操作区
 */
export const useToolbar = (toolbarConfig: Ref) => ({
  ...toRefs(
    {
      ...toolbarConfig?.value,
    },
  ),
})

/**
 * table区
 */
export const useList = (listConfig: Ref) => ({
  ...toRefs({
    request: void 0,
    postData: void 0,
    columns: [],
    actions: () => ([]),
    ...listConfig?.value,
  }),
})

/**
 * 翻页区
 */
export const usePagination = (paginationConfig: Ref) => ({
  ...toRefs(
    {
      showPager: true,
      pagination: { total: 0, pageNo: 1, pageSize: 10 },
      sizeList: [10, 20, 30, 40, 50],
      ...paginationConfig?.value,
    },
  ),
})
