<template>
  <div class="wrapper">
    <beco-page-list
      :filter-config="schema.filterConfig"
      :toolbar-config="schema.toolbarConfig"
      :list-config="schema.listConfig"
      :pagination-config="schema.paginationConfig"
    />
  </div>
</template>

<script lang="tsx">
  import {
    defineComponent, computed,
  } from 'vue'
  import {
    NewBsBox, BeerIcon, BeerTooltip, SingleDatePicker, toaster,
  } from '@xhs/yam-beer'
  import BecoPageList from './components/beco-page-list.vue'
  import {
    getList, delRowItem, updateRowItem, addRowItem,
  } from '../../../services/index'
  import {
    IToolbarConfig, IListConfig, IPaginationConfig,
  } from './components/utils/page-list.props'

  export type ISchema = {
    filterConfig: any
    toolbarConfig: IToolbarConfig
    listConfig:IListConfig
    paginationConfig: IPaginationConfig
  }

  export default defineComponent({
    name: 'NoteManager',
    components: {
      BecoPageList,
    },
    setup() {
      const schema = {
        filterConfig: {
          // submitText: '查询',
          formConfig: computed(() => ({
            layout: 'Inline',
            children: [
              {
                name: 'name',
                formItem: {
                  label: '商品名称',
                  isHorizontal: true,
                },
                component: {
                  placeholder: '请输入商品名称进行搜索',
                },
              },
              {
                name: 'spuId',
                formItem: {
                  label: 'SPUID',
                  isHorizontal: true,
                },
                component: {
                  placeholder: '请输入spuId进行搜索',
                },
              },
              {
                name: 'status',
                formItem: {
                  label: '商品状态',
                  isHorizontal: true,
                },
                defaultValue: '全部',
                component: {
                  is: 'SingleSelect',
                  props: {
                    options: [
                      { name: '全部', value: '全部' },
                      { name: '在架上', value: 1 },
                      { name: '已下架', value: 2 },
                    ],
                  },
                },
              },
              {
                name: 'createTime',
                formItem: {
                  label: '创建时间',
                  isHorizontal: true,
                  tooltip: '搜索选定时间之前创建的商品',
                },
                component: {
                  // is: 'SingleDatePicker',
                  is: SingleDatePicker,
                  placeholder: '请选择时间',
                },
              },
            ],
          })),
        },
        toolbarConfig: {
          actions: [
            {
              type: 'form',
              label: '新增',
              modalConfig: () => computed(() => ({
                submit: (model:any) => addRowItem(model),
                formConfig: [
                  {
                    config: {
                      children: [
                        {
                          name: 'name',
                          required: true,
                          formItem: {
                            label: '商品名称',
                            isHorizontal: true,
                          },
                          component: {
                            props: {
                              bs: {
                                width: 350,
                              },
                              placeholder: '请输入商品名称',
                            },
                          },
                        },
                        {
                          name: 'spuId',
                          required: true,
                          formItem: {
                            label: 'SPUID',
                            isHorizontal: true,
                          },
                          component: {
                            props: {
                              bs: {
                                width: 350,
                              },
                              placeholder: '请自定义填写spuId',
                            },
                          },
                        },
                        {
                          name: 'status',
                          required: true,
                          formItem: {
                            label: '商品状态',
                            isHorizontal: true,
                          },
                          component: {
                            is: 'SingleSelect',
                            props: {
                              bs: {
                                width: 350,
                              },
                              placeholder: '请选择商品状态',
                              options: [
                                { name: '在架上', value: 1 },
                                { name: '已下架', value: 2 },
                              ],
                            },
                          },
                        },
                        {
                          name: 'sku',
                          required: true,
                          formItem: {
                            label: '库存',
                            isHorizontal: true,
                          },
                          component: {
                            props: {
                              bs: {
                                width: 350,
                              },
                              placeholder: '请输入库存',
                            },
                          },
                        },
                      ],
                    },
                  },
                ],
              })),
              genInitData: () => ({
                name: void 0,
                spuId: void 0,
                status: void 0,
                sku: void 0,
              }),
            },
            {
              type: 'custom',
              label: '全部导出',
              genStyle: () => ({
                modifier: 'success',
              }),
              callback: () => {
                toaster.notify('导出逻辑可自行实现')
              },
            },
          ],
          // settings: [
          //   {
          //     type: 'custom',
          //     label: '页面配置',
          //     tooltip: '点击可以查看页面配置代码',
          //     genStyle: () => ({
          //       variant: 'text',
          //     }),
          //     callback: () => {
          //       window.open('https://code.devops.xiaohongshu.com/fe/becoui/-/blob/master/src/pages/BasicList/BasicList.vue', '_blank')
          //     },
          //   },
          // ],
        },
        listConfig: {
          request: getList,
          postData: (res:any) => (res.list),
          columns: [
            {
              title: '商品信息',
              key: 'goodInfo',
              td: {
                bs: { width: '445px' },
                is: (data:any) => {
                  const { rowData: { name, img, spuId } } = data.props

                  return (
                    <NewBsBox bs={{ display: 'flex' }}>
                      <img style={{ width: '70px', height: '70px' }} src={img}/>
                      <NewBsBox bs={{ ml: '8px' }}>
                        <NewBsBox bs={{ mb: '8px', mt: '8px', color: '#3a64ff' }}>{ name }</NewBsBox>
                        <NewBsBox>SPUID : { spuId }</NewBsBox>
                      </NewBsBox>
                    </NewBsBox>
                  )
                },
              },
            },
            {
              title: '库存',
              td: {
                is: (data:any) => {
                  const { rowData: { sku } } = data.props
                  return `${(sku).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')}`
                },
              },
            },
            {
              th: {
                is: () => (
                    <NewBsBox bs={{ display: 'flex', alignItems: 'center' }}>
                      <NewBsBox bs={{ mr: '5px' }}>累计销量</NewBsBox>
                      <BeerTooltip content="商品自创建后支付成功的商品数量总计，有1天延迟，最新数据更新时间：2021-06-02 02:14:37">
                        <BeerIcon icon="exclamation-marks-b" />
                      </BeerTooltip>
                    </NewBsBox>
                ),
              },
              td: {
                is: (data:any) => {
                  const { rowData } = data.props
                  return `${rowData.sellNum || '-'}`
                },
              },
            },
            {
              title: '商品状态',
              td: {
                is: (data:any) => {
                  const { rowData: { status } } = data.props

                  const statusMap:{[key: number]: string} = {
                    1: '在架上',
                    2: '已下架',
                  }

                  const statusStyleMap:{[key: number]: string} = {
                    1: 'rgb(255, 82, 93)',
                    2: 'rgb(45, 45, 45)',
                  }

                  return <NewBsBox bs={{ color: statusStyleMap[status] }}>{statusMap[status]}</NewBsBox>
                },
              },
            },
            { title: '创建时间', key: 'createTime' },
          ],
          actions: (rowData:any) => ([
            {
              type: 'form',
              label: '编辑',
              modalConfig: () => computed(() => ({
                submit: (model:any) => updateRowItem({ id: model.id, sku: model.sku }),
                formConfig: [
                  {
                    config: {
                      children: [
                        {
                          name: 'spuId',
                          required: true,
                          formItem: {
                            label: 'SPUID',
                            isHorizontal: true,
                          },
                          component: {
                            props: {
                              bs: {
                                width: 350,
                              },
                              disabled: true,
                            },
                          },
                        },
                        {
                          name: 'sku',
                          required: true,
                          formItem: {
                            label: '库存',
                            isHorizontal: true,
                          },
                          component: {

                            props: {
                              bs: {
                                width: 350,
                              },
                              placeholder: '请输入库存',
                            },
                          },
                        },
                      ],
                    },
                  },
                ],
              })),
              genInitData: (rowData:any) => {
                const { id, spuId, sku } = rowData
                return {
                  id,
                  spuId,
                  sku,
                }
              },
              callback: (formData:any) => updateRowItem({ id: formData.id, sku: formData.sku }),
            },
            {
              type: 'confirm',
              label: '删除',
              callback: () => delRowItem({ id: rowData?.id }),
            },
          ]),
        },
        paginationConfig: {
          sizeList: [10, 20, 30, 40, 50],
          pagination: { total: 0, pageNo: 1, pageSize: 20 },
        },
      }
      return {
        schema,
      }
    },
  })
</script>
<style lang="stylus" scoped>
.wrapper
  padding 20px

:deep(.modal-beer-box)
  width 108px
  .css-1t8wpoj
    justify-content flex-end
</style>
