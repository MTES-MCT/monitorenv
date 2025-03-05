import { get } from 'lodash-es'

const SortType = {
  ASC: 'asc',
  DESC: 'desc'
}

export function sortMissionsByProperty(a, b, sortColumn, sortType) {
  const x = get(a, sortColumn)
  const y = get(b, sortColumn)

  if (typeof x === 'string' && typeof y === 'string') {
    if (sortType === SortType.ASC) {
      return x.localeCompare(y)
    }

    return y.localeCompare(x)
  }

  if (x === '' || x === null) {
    return 1
  }
  if (y === '' || y === null) {
    return -1
  }

  if (sortType === SortType.ASC) {
    return x - y
  }

  return y - x
}
