import { isEmpty } from 'lodash/fp'

export function isEmptyish(value: any) {
  if (typeof value === 'string') {
    return !value.trim().length
  }

  return isEmpty(value)
}
