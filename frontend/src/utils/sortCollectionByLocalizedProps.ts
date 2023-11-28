import { property } from 'lodash/fp'

import type { AnyObject } from '@mtes-mct/monitor-ui/types'

export function sortCollectionByLocalizedProps<T = AnyObject>(propPaths: string[], collection: T[]): T[] {
  return collection.sort((a, b) => {
    const aPropValues = propPaths.map(propPath => property(propPath, a))
    const bPropValues = propPaths.map(propPath => property(propPath, b))

    const comparisonResult = aPropValues.reduce((result, aNextPropValue, index) => {
      // If a previous comparison already found a difference, we don't need to compare the next prop values.
      if (result !== 0) {
        return result
      }

      const bNextPropValue = bPropValues[index]

      if (typeof aNextPropValue === 'number' && typeof bNextPropValue === 'number') {
        return aNextPropValue - bNextPropValue
      }

      if (typeof aNextPropValue === 'string' && typeof bNextPropValue === 'string') {
        return aNextPropValue.localeCompare(bNextPropValue)
      }

      throw new Error('utils/sortCollectionByLocalizedProps(): Property values must either be numbers or strings.')
    }, 0)

    return comparisonResult
  })
}
