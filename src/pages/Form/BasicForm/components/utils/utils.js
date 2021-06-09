const isVueComponent = component => typeof component?.render === 'function' || !!component?.mixins
const capitalize = str => `${str.slice(0, 1).toUpperCase()}${str.slice(1)}`

export const getComponent = (is, componentMap) => {
  if (isVueComponent(is)) {
    return is
  }
  const component = componentMap[is] ?? componentMap[capitalize(is)]

  if (component) {
    return component
  }

  throw new Error(`[BecoUI] Could not found component named '${is}', please check 'component.is'`)
}

/**
 * 内置的校验规则
 */
const messages = {
  required: '必填项',
  number: '应该是 Number 类型',
  string: '应该是 String 类型',
  boolean: '应该是 Boolean 类型',
  object: '应该是 Object 类型',
  array: '应该是 Array 类型',
  max: '不能大于 ${limit}',
  min: '不能小于 ${limit}',
  maxLength: '超出 ${limit} 字符限制',
  minLength: '不能少于 ${limit} 字符',
  maxChineseLength: '超出 ${limit} 中文限制',
  minChineseLength: '不能少于 ${limit} 中文',
  url: '链接不合法',
}

const getMessage = (key, options = {}) => (options.msg ?? messages[key]).replace('${limit}', options.limit)
const getChineseLength = value => value.split('').reduce((acc, cur) => (/[\u4E00-\u9FA5\uF900-\uFA2D]/.test(cur) ? acc + 2 : acc + 1), 0)
const isEmpty = value => value === null || value === undefined || value === ''
const rules = {
  required: msg => value => isEmpty(value) && getMessage('required', { msg }),
  number: msg => value => typeof value !== 'number' && getMessage('number', { msg }),
  string: msg => value => typeof value !== 'string' && getMessage('string', { msg }),
  boolean: msg => value => typeof value !== 'boolean' && getMessage('boolean', { msg }),
  object: msg => value => typeof value !== 'object' && getMessage('object', { msg }),
  array: msg => value => !Array.isArray(value) && getMessage('array', { msg }),
  max: (limit, msg) => value => (value > limit) && getMessage('max', { limit, msg }),
  min: (limit, msg) => value => (value < limit) && getMessage('min', { limit, msg }),
  maxLength: (limit, msg) => value => (value.length > limit) && getMessage('maxLength', { limit, msg }),
  minLength: (limit, msg) => value => (value.length < limit) && getMessage('minLength', { limit, msg }),
  maxChineseLength: (limit, msg) => value => (getChineseLength(value) > limit * 2) && getMessage('maxChineseLength', { limit, msg }),
  minChineseLength: (limit, msg) => value => (getChineseLength(value) < limit * 2) && getMessage('minChineseLength', { limit, msg }),
  url: msg => value => !(/^(https?:|xhsdiscover:)\/\//.test(value)) && getMessage('url', { msg }),
}

/**
 * 校验处理逻辑
 */
export const stdValidations = ({
  required, requiredMessage, type, validation,
}) => {
  // 封装校验结果
  const wrapValidation = (validate, isRequired) => async function wrappedValidation(value) {
    const result = {
      validatedValue: value,
    }

    if (!isRequired && isEmpty(value)) {
      return result
    }

    const validationMessage = validate(value)

    if (!validationMessage) {
      return result
    }

    if (typeof validationMessage === 'string') {
      result.validationMessage = validationMessage
      throw result
    }

    if (validationMessage instanceof Promise) {
      try {
        result.ret = await validationMessage
        return result
      } catch (msg) {
        result.validationMessage = msg
        throw result
      }
    }

    return undefined
  }
  const isTemplateValidation = template => Array.isArray(template) && typeof template[0] === 'string'
  const parseTemplateValidation = (template, rules) => {
    const [name, ...params] = template
    return rules[name](...params)
  }

  const validations = []

  if (required === true) {
    validations.push(wrapValidation(rules.required(requiredMessage), true))
  }

  if (typeof type === 'string') {
    validations.push(wrapValidation(rules[type]()))
  }

  if (validation) {
    if (typeof validation === 'function') {
      validations.push(wrapValidation(validation))
    } else if (isTemplateValidation(validation)) {
      validations.push(wrapValidation(parseTemplateValidation(validation, rules)))
    } else {
      validation.forEach(item => {
        if (isTemplateValidation(item)) {
          validations.push(wrapValidation(parseTemplateValidation(item, rules)))
        } else {
          validations.push(wrapValidation(item))
        }
      })
    }
  }

  return validations
}
