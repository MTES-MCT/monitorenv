import _ from 'lodash'

const SortType = {
  ASC: 'asc',
  DESC: 'desc'
}

export function sortMissionsByProperty (a, b, sortColumn, sortType) {
  let x = _.get(a, sortColumn)
  let y = _.get(b, sortColumn)

  if (typeof x === 'string' && typeof y === 'string') {
    if (sortType === SortType.ASC) {
      return x.localeCompare(y)
    } else {
      return y.localeCompare(x)
    }
  }

  if (x === '' || x === null) {
    return 1
  }
  if (y === '' || y === null) {
    return -1
  }

  if (sortType === SortType.ASC) {
    return x - y
  } else {
    return y - x
  }
}
