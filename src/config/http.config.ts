import { HttpConfig } from '@xhs/launcher'

// const loganProxyForDevelopment = 'http://logan.devops.xiaohongshu.com/proxy/muxia-beco-ui'
const loganProxyForDevelopment = ''
const httpConfig: HttpConfig = {
  BASE_URL: {
    development: loganProxyForDevelopment,
    production: process.env.BROWSER ? '' : 'https://www.xiaohongshu.com',
  },
  API_LIST: {
    BASIC_LIST: '/basic/list',
    BASIC_LIST_DEL_ITEM: '/basic/list/delete',
    BASIC_LIST_UPDATE_ITEM: '/basic/list/update',
    BASIC_LIST_ADD_ITEM: '/basic/list/add',
  },
  BASE_CONFIG: {
    defaults: {
      timeout: process.env.BROWSER ? 10000 : 3000,
    },
    development: {
      withCredentials: true,
    },
  },
}

export default httpConfig
