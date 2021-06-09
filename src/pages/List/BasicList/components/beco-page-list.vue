<template>
  <!-- 查询表单配置 -->
  <SearchSection
    v-model="filters"
    :config="formConfig"
    :submit-text="submitText"
    :reset-text="resetText"
    :handle-search="fetchData"
    :handle-reset="handleFilterReset"
  />

  <BeerPanel :bs="{p:20, my:0}">
    <!-- 列表工具栏配置 -->
    <NewBsBox
      v-if="false || (toolbarActions.length || toolbarSettings.length)"
      class="beco-page-list-toolbar beco-page-list-flex"
    >
      <NewBsBox>
        <template
          v-for="(toolbarActionItem, index) in toolbarActions"
          :key="index"
        >
          <BeerTooltip
            v-if="toolbarActionItem.tooltip"
            :content="toolbarActionItem.tooltip"
          >
            <BeerButton
              v-if="toolbarActionItem.tooltip"
              v-bind="genToolbarAttr(toolbarActionItem)"
              @click="handleToolbarClick(toolbarActionItem)"
            >
              {{ toolbarActionItem.label }}
            </BeerButton>
          </BeerTooltip>

          <BeerButton
            v-else
            v-bind="genToolbarAttr(toolbarActionItem)"
            @click="handleToolbarClick(toolbarActionItem)"
          >
            {{ toolbarActionItem.label }}
          </BeerButton>
        </template>
      </NewBsBox>
      <NewBsBox>
        <template
          v-for="(toolbarSettingItem, index) in toolbarSettings"
          :key="index"
        >
          <BeerTooltip
            v-if="toolbarSettingItem.tooltip"
            :content="toolbarSettingItem.tooltip"
          >
            <BeerButton
              v-if="toolbarSettingItem.tooltip"
              v-bind="genToolbarAttr(toolbarSettingItem)"
              @click="handleToolbarClick(toolbarSettingItem)"
            >
              {{ toolbarSettingItem.label }}
            </BeerButton>
          </BeerTooltip>

          <BeerButton
            v-else
            v-bind="genToolbarAttr(toolbarSettingItem)"
            @click="handleToolbarClick(toolbarSettingItem)"
          >
            {{ toolbarSettingItem.label }}
          </BeerButton>
        </template>
      </NewBsBox>
    </NewBsBox>

    <!-- 列表内容区域 -->
    <BeerTable
      v-beering="isFetching"
      border-style="none"
      size="s"
      :data="data"
      :columns="columns"
      placeholder="暂无数据"
    >
      <template
        v-if="actions().length"
        #operates="{ rowData }"
      >
        <NewBsBox>
          <template
            v-for="(actionItem, index) in actions(rowData)"
            :key="index"
          >
            <BeerButton
              v-if="actionItem.show === undefined ? true : actionItem.show"
              v-bind="genActionAttr(actionItem)"
              @click="handleActionClick(actionItem, rowData)"
            >
              {{ actionItem.label }}
            </BeerButton>
          </template>
        </NewBsBox>
      </template>
    </BeerTable>

    <!-- 列表分页配置 -->
    <Pagination
      v-if="showPager"
      :model-value="pagination"
      align="flex-end"
      :size-list="sizeList"
      class="beco-page-list-pager"
      @update:modelValue="handlePaginationChange"
    />
  </BeerPanel>

  <!-- 查看与编辑弹窗 -->
  <BeerModal
    :show="formModal.modelShow"
    :title="formModal.title"
    size="550px"
    :scroll-content="false"
    confirm-text=""
    cancel-text=""
    :handle-close="formModal.handleFormModalClose"
  >
    <BecoPageFormModal
      v-model="formModalData"
      :form-schema="formModalConfig"
    >
      <template #submit-button="{isSubmitting, submitText, handleSubmit}">
        <BeerButton
          :disabled="isSubmitting"
          @click="handleCustomSubmit(handleSubmit)"
        >{{ submitText }}</BeerButton>
      </template>
    </BecoPageFormModal>
  </BeerModal>
</template>

<script lang="ts">
  import {
    reactive,
    defineComponent,
    toRefs,
    toRaw,
    ref,
    shallowRef,
    onMounted,
  } from 'vue'
  import { useRouter } from 'vue-router'
  import {
    NewBsBox,
    BeerButton,
    withLoading,
    withDialog,
    BeerModal,
    BeerTable,
    Pagination,
    BeerPanel,
    toaster,
    BeerTooltip,
  } from '@xhs/yam-beer'
  import SearchSection from './utils/search-section/search-section.vue'
  import props, {
    IToolbarItem, IPagation, ACTION_TYPE, IListActionItem,
  } from './utils/page-list.props'
  import {
    useFilter, useToolbar, useList, usePagination,
  } from './utils/composables'

  import BecoPageFormModal from '../../../Form/BasicForm/components/beco-page-form-modal.vue'

  const DEFAULT_ERROR = '请求错误'
  const DEFAULT_DESCRIPTION = '请确认是否操作?'
  const DEFAULT_SUCCESS = '操作成功'

  export default defineComponent({
    name: 'BecoPageList',
    components: {
      NewBsBox,
      BeerButton,
      BeerModal,
      BeerPanel,
      BecoPageFormModal,
      BeerTooltip,
      BeerTable,
      Pagination,
      SearchSection,
    },
    props,
    setup(props) {
      const router = useRouter()

      // 全屏loading
      const globalLoading = withLoading({ showAtInit: false }) as {
        close(clearAll?: boolean): void
        clearAll(): void
        toggle(): void
        show(): void
      }

      // 弹窗
      const formModal = reactive({
        title: '',
        modelShow: false,
        handleFormModalClose: () => {},
      })
      const formModalConfig = shallowRef({})
      const formModalData = ref({} as any)

      const {
        filterConfig, toolbarConfig, listConfig, paginationConfig,
      } = toRefs(props)
      const { submitText, resetText, formConfig } = useFilter(filterConfig!)
      const { actions: toolbarActions = [], settings: toolbarSettings = [] } = useToolbar(toolbarConfig!)
      const {
        request, postData, columns, actions,
      } = useList(listConfig!)
      if (actions.value()?.length) {
        columns.value = columns.value.concat({
          title: '操作',
          td: {
            is: 'operates',
          },
        })
      }

      const { showPager, pagination, sizeList } = usePagination(paginationConfig!)

      /* 数据筛选区 */
      const filters = ref({} as any)

      /* table区 */
      const data = ref([])
      const isFetching = ref(false)
      const fetchData = () => {
        if (request?.value) {
          const pageParams = showPager
            ? { pageNo: pagination.value.pageNo, pageSize: pagination.value.pageSize }
            : {}

          // 标准化查询表单输入
          const stdFilters = toRaw(filters.value)
          Object.keys(stdFilters).forEach((filter:string) => {
            if (typeof stdFilters[filter] === 'string') {
              stdFilters[filter] = stdFilters[filter].trim()
            }
          })
          const params = { ...stdFilters, ...pageParams }
          isFetching.value = true
          return request.value(params)
            .then((res:any) => {
              if (typeof postData.value === 'function') {
                data.value = postData.value(res)
              } else {
                data.value = res.data
              }

              pagination.value = {
                ...pagination.value,
                total: res.total,
              }
            })
            .catch((e:any) => toaster.warning(e?.message || DEFAULT_ERROR, { id: 'list' }))
            .finally(() => {
              isFetching.value = false
            })
        }
        return toaster.warning('request必须配置', { id: 'error' })
      }
      // table 操作区样式
      const genActionAttr = (actionItem:IListActionItem) => {
        const { type, genStyle } = actionItem
        if (type === ACTION_TYPE.link) {
          return {
            variant: 'text',
            bs: {
              m: 0,
              mr: '10px',
              minWidth: 'auto',
              p: 0,
            },
            ...genStyle?.(),
          }
        }
        if (type === ACTION_TYPE.confirm) {
          return {
            modifier: 'danger',
            variant: 'text',
            bs: {
              m: 0,
              mr: '10px',
              minWidth: 'auto',
              p: 0,
            },
            ...genStyle?.(),
          }
        }
        if (type === ACTION_TYPE.list || type === ACTION_TYPE.form) {
          return {
            variant: 'text',
            bs: {
              m: 0,
              mr: '10px',
              minWidth: 'auto',
              p: 0,
            },
            ...genStyle?.(),
          }
        }
        if (type === ACTION_TYPE.custom) {
          return { ...genStyle?.() }
        }
      }

      onMounted(() => {
        fetchData()
      })

      // 重置
      const handleFilterReset = () => {
        pagination.value = paginationConfig?.value?.pagination || pagination.value

        // formConfig就是一个最基础的表单配置
        formConfig.value.children.forEach((child: any) => {
          filters.value[child.name] = child.defaultValue !== undefined ? child.defaultValue : void 0
        })

        fetchData()
      }

      // 分页
      const handlePaginationChange = (newV: IPagation) => {
        pagination.value = newV
        fetchData()
      }

      // 列表工具栏配置
      const genToolbarAttr = (toolbarItem:IToolbarItem) => {
        const { genStyle } = toolbarItem
        return genStyle?.()
      }
      const handleToolbarClick = (toolbarActionItem:IToolbarItem) => {
        const {
          type, genPath, label, genInitData, modalConfig, callback, description,
        } = toolbarActionItem
        if (type === 'form') {
          formModal.title = label as string
          formModalData.value = genInitData?.({})
          formModalConfig.value = modalConfig?.(formModalData.value, {}).value
          formModal.modelShow = true
          formModal.handleFormModalClose = () => {
            formModal.modelShow = !formModal.modelShow
          }
        } else if (type === 'link') {
          if (genPath) {
            router.push(genPath())
          } else {
            toaster.warning('缺少genPath配置，请检查')
          }
        } else if (type === 'confirm') {
          const openDialog = withDialog({
            title: description || DEFAULT_DESCRIPTION,
          })

          openDialog(() => {
            if (callback) {
              globalLoading.show()
              callback()
                .then(() => {
                  toaster.success(DEFAULT_SUCCESS, { id: 'confirm' })
                  // fetchData()
                })
                .catch((e:any) => toaster.danger(e?.message || DEFAULT_ERROR))
                .finally(() => {
                  globalLoading.close()
                })
            } else {
              toaster.warning('缺少callback配置，请检查', { id: 'setting' })
            }
          })
        } else if (type === 'custom') {
          // 这里处理自定义逻辑（可直接修改代码）
          callback?.()?.then((res:any) => {
            toaster.success(res?.msg || DEFAULT_SUCCESS, { id: 'list' })
          })?.catch((e:any) => toaster.danger(e?.message || DEFAULT_ERROR))
        }
      }

      const handleCustomSubmit = async (handleSubmit:any) => {
        await handleSubmit()
        toaster.success(DEFAULT_SUCCESS, { id: 'list' })
        formModal.handleFormModalClose()
        fetchData()
      }

      // table操作
      const handleActionClick = (actionItem:IListActionItem, rowData:any) => {
        const {
          type, genPath, description, callback, label, genInitData, modalConfig,
        } = actionItem
        if (type === ACTION_TYPE.link) {
          if (genPath) {
            router.push(genPath(rowData))
          } else {
            toaster.warning('缺少genPath配置，请检查')
          }
        } else if (type === ACTION_TYPE.confirm) {
          const openDialog = withDialog({
            title: description || DEFAULT_DESCRIPTION,
          })

          openDialog(() => {
            if (callback) {
              globalLoading.show()
              callback(rowData)
                .then(() => {
                  toaster.success(DEFAULT_SUCCESS, { id: 'confirm' })
                  fetchData()
                })
                .catch((e:any) => toaster.danger(e?.message || DEFAULT_ERROR))
                .finally(() => {
                  globalLoading.close()
                })
            } else {
              toaster.warning('缺少callback配置，请检查', { id: 'setting' })
            }
          })
        } else if (type === ACTION_TYPE.list) {
          formModal.title = label as string
          formModalData.value = genInitData?.(rowData)
          formModalConfig.value = modalConfig?.(formModalData.value).value
          formModal.modelShow = true
          formModal.handleFormModalClose = () => {
            formModal.modelShow = !formModal.modelShow
          }
        } else if (type === ACTION_TYPE.form) {
          formModal.title = label as string
          formModalData.value = genInitData?.(rowData)
          formModalConfig.value = modalConfig?.(formModalData.value, {}).value
          formModal.modelShow = true
          formModal.handleFormModalClose = () => {
            formModal.modelShow = !formModal.modelShow
          }
        } else if (type === ACTION_TYPE.custom) {
          return callback?.()
        }
      }

      return {
        /* 查询表单配置 */
        filters,
        handleFilterReset,
        submitText,
        resetText,
        formConfig,
        fetchData,

        /* 工具栏 */
        toolbarActions,
        toolbarSettings,
        handleToolbarClick,
        genToolbarAttr,

        /* 内容区域 */
        genActionAttr,
        isFetching,
        columns,
        actions,
        data,
        handleActionClick,

        /* 分页配置 */
        showPager,
        pagination,
        sizeList,
        handlePaginationChange,

        /* 查看与编辑弹窗 */
        formModal,
        formModalConfig,
        formModalData,
        handleCustomSubmit,
      }
    },
  })

</script>

<style lang="stylus" scoped>
NORMAL_GAP = 16px
LIST_PREFIX = beco-page-list

.{LIST_PREFIX}-title, .{LIST_PREFIX}-toolbar{
  margin-bottom NORMAL_GAP
}
.{LIST_PREFIX}-flex{
  display flex
  justify-content space-between
  align-items center
}
.{LIST_PREFIX}-loading{
  display flex
  justify-content center
  align-items center
}
.{LIST_PREFIX}-pager{
  margin-top NORMAL_GAP
}
.{LIST_PREFIX}-btn{
  margin: 0
  margin-right: 10px
  padding: 0
  min-width auto
}

.{LIST_PREFIX}
  :deep(.css-145zvec)
    width 108px
    .css-1t8wpoj
      justify-content flex-end

  :deep(.operation-patch)
    padding-bottom 24px
</style>
