import Mock from 'mockjs'
import * as dayjs from 'dayjs'

const dataList = []
for (let i = 0; i < 150; i++) {
  dataList.push(Mock.mock({
    id: '@increment',
    name: '@ctitle(15)',
    'img|1': [
      'http://qimg.xiaohongshu.com/aqua/4b2795097c96940c4a82827ad9f6e3eb86af80d6',
      'https://ci.xiaohongshu.com/e25d01dd-e150-4003-9b8c-81ab3fb69dc1@r_640w_640h.jpg',
      'http://qimg.xiaohongshu.com/arkgoods/b2173ea7b85c192f88ae6ecccd0bf23d9b94e797',
      'http://qimg.xiaohongshu.com/c5b6589a7d6cc63d86b083f4703676a7f2bd60b8',
    ],
    spuId: Mock.Random.id(),
    'sku|300-9999': 30,
    'sellNum|10-299': 30,
    createTime: '@date("yyyy-MM-dd HH:MM:ss")',
    'status|1': [1, 2], // ['在架上', '已下架']
  }))
}

const getQueryStr = (url, key) => {
  let queryString = decodeURI(url)?.split('?')[1]
  const obj = {}

  if (!queryString) {
    return obj
  }

  queryString = queryString.split('#')[0]
  const arr = queryString.split('&')
  for (let i = 0; i < arr.length; i++) {
    const a = arr[i].split('=')

    const paramName = a[0]
    const paramValue = typeof (a[1]) === 'undefined' ? true : a[1]

    if (paramName.match(/\[(\d+)?\]$/)) {
      const key = paramName.replace(/\[(\d+)?\]/, '')
      if (!obj[key]) obj[key] = []

      if (paramName.match(/\[\d+\]$/)) {
        const index = /\[(\d+)\]/.exec(paramName)[1]
        obj[key][index] = paramValue
      } else {
        obj[key].push(paramValue)
      }
    } else if (!obj[paramName]) {
      obj[paramName] = paramValue
    } else if (obj[paramName] && typeof obj[paramName] === 'string') {
      obj[paramName] = [obj[paramName]]
      obj[paramName].push(paramValue)
    } else {
      obj[paramName].push(paramValue)
    }
  }

  return obj[key]
}

const pagination = (pageNo, pageSize, list) => {
  const start = (pageNo - 1) * pageSize

  let end
  if (pageNo * pageSize > list.length) {
    end = list.length
  } else {
    end = pageNo * pageSize
  }

  return list.slice(start, end)
}

// 列表搜索
Mock.mock(new RegExp('/basic/list'), 'get', opts => {
  let list = []
  const name = getQueryStr(opts.url, 'name')
  const spuId = getQueryStr(opts.url, 'spuId')
  const status = getQueryStr(opts.url, 'status')
  const createTime = getQueryStr(opts.url, 'createTime')

  list = dataList

  if (name) {
    list = list.filter(item => item.name.indexOf(name) !== -1)
  }
  if (spuId) {
    list = list.filter(item => item.spuId.indexOf(spuId) !== -1)
  }

  if (status) {
    if (status !== '全部') {
      list = list.filter(item => item.status === Number(status))
    }
  }
  if (createTime) {
    list = list.filter(item => dayjs(item.createTime).isBefore(dayjs(createTime)))
  }

  const pageNo = getQueryStr(opts.url, 'pageNo')
  const pageSize = getQueryStr(opts.url, 'pageSize')
  const total = list.length
  list = pagination(pageNo, pageSize, list)
  return {
    error_code: 0,
    result: 0,
    success: true,
    data: {
      total,
      list,
    },
  }
})

// 删除
Mock.mock(new RegExp('/basic/list/delete'), 'post', opts => {
  const { id } = JSON.parse(opts.body || '{}')
  dataList.splice(dataList.findIndex(item => item.id === id), 1)
  return {
    error_code: 0,
    result: 0,
    success: true,
    data: null,
  }
})

// 编辑
Mock.mock(new RegExp('/basic/list/update'), 'post', opts => {
  const { id, sku } = JSON.parse(opts.body || '{}')
  const index = dataList.findIndex(item => item.id === id)
  dataList[index].sku = sku
  return {
    error_code: 0,
    result: 0,
    success: true,
    data: null,
  }
})

// 新增
Mock.mock(new RegExp('/basic/list/add'), 'post', opts => {
  const {
    name, spuId, status, sku,
  } = JSON.parse(opts.body || '{}')
  dataList.unshift({
    id: dataList.length + 1,
    img: 'http://qimg.xiaohongshu.com/aqua/340c03010e448dca2fae6b4b2e82289ec3db5b64',
    name,
    spuId,
    status,
    sku,
    sellNum: 0,
    createTime: dayjs().format('YYYY-MM-DD HH:MM:ss'),
  })
  return {
    code: 0,
    msg: 'success',
  }
})
