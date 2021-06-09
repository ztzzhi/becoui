import { LauncherOptions } from '@xhs/launcher'

const routes: LauncherOptions['routes'] = [
  {
    path: '/',
    redirect: '/list/basic-list',
    component: () => import('../layout/Layout.vue'),
    children: [
      {
        path: 'dashboard/monitor',
        name: 'monitor',
        component: () => import('../pages/Dashboard/Monitor/Monitor.vue'),
      },
      {
        path: 'list/basic-list',
        name: 'tableList',
        component: () => import('../pages/List/BasicList/BasicList.vue'),
        meta: { title: '查询表格' },
      },
      {
        path: 'list/normal-list',
        name: 'normalList',
        component: () => import('../pages/List/NormalList/NormalList.vue'),
        meta: { title: '标准列表' },
      },
      {
        path: 'form/basic-form',
        name: 'basicForm',
        component: () => import('../pages/Form/BasicForm/basic-form.vue'),
        meta: { title: '基础表单' },
      },
      {
        path: 'form/advanced-form',
        name: 'advancedForm',
        component: () => import('../pages/Form/AdvancedForm/advanced-form.vue'),
        meta: { title: '高级表单' },
      },
    ],
  },
]

export default routes
