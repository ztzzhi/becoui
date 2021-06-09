import { http } from '@xhs/launcher'

const { get, post } = http

export function getList(payload:any):Promise<any> {
  return get('BASIC_LIST', { params: payload })
}

export function delRowItem(payload:any):Promise<any> {
  return post('BASIC_LIST_DEL_ITEM', payload)
}

export function updateRowItem(payload:any):Promise<any> {
  return post('BASIC_LIST_UPDATE_ITEM', payload)
}

export function addRowItem(payload:any):Promise<any> {
  return post('BASIC_LIST_ADD_ITEM', payload)
}
