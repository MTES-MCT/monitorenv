import { isNotArchived } from '@utils/isNotArchived'

import { getFilters } from '../utils'

import type { ControlUnit } from '@mtes-mct/monitor-ui'

export const getFilteredControlUnits = (cacheKey, filtersState, controlUnits): ControlUnit.ControlUnit[] => {
  const activeControlUnits = controlUnits?.filter(isNotArchived)

  if (!activeControlUnits) {
    return []
  }

  const filters = getFilters(activeControlUnits, filtersState, cacheKey)

  return filters.reduce((previousControlUnits, filter) => filter(previousControlUnits), activeControlUnits)
}
