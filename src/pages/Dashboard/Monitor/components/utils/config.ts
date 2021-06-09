export const BASE_LAYOUT = {
  columnNum: 5,
  gap: 20,
}

export const DATA_TYPES = {
  COMMA: 'comma',
  PERCENT: 'percent',
  CUSTOM: 'costom', // 表示需要自定义格式化信息
}

export const BASE_CARD_CONFIG = {
  dataType: DATA_TYPES.COMMA,
  tipText: '默认文本',
}

export const BASE_TOOLTIP_CONFIG = {
  is: 'tipText',
  placement: 'right',
}

export const BASE_CARD_STYLE = {
  border: '1px solid #E8E8E8',
  backgroundColor: '#fff',
  p: '12px 16px',
  borderRadius: 8,
  width: '100%',
}

export const BASE_DATA_STYLE = {
  p: '10px 0',
  fontWeight: 800,
  fontSize: 22,
  lineHeight: 20,
  color: '#2D2D2D',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  fontFamily: 'Avenir',
}

export const formatDataToComma = (data: number, tag: string = ',') => {
  const str: string = data.toString(10)
  const arr = str.split('.')
  const len = arr.length === 1 ? str.length : arr[0].length
  let index: number = len - 1
  let res = ''
  while (index >= 0) {
    const n = len - index - 1
    if (n !== 0 && n % 3 === 0) {
      res = tag + res
    }
    res = str[index--] + res // eslint-disable-line
  }
  return res + (arr[1] ? `.${arr[1]}` : '')
}

export const formatDataToPercent = (data: number) => `${(data * 100).toFixed(2)}%`
