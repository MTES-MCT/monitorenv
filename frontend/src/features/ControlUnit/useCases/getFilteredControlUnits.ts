import { isNotArchived } from '@utils/isNotArchived'

import { getFilters } from '../utils'

import type { FiltersState } from '../components/ControlUnitListDialog/types'
import type { ControlUnit } from '@mtes-mct/monitor-ui'

export const getFilteredControlUnits = (
  cacheKey: string,
  filtersState: FiltersState,
  controlUnits: ControlUnit.ControlUnit[]
): ControlUnit.ControlUnit[] => {
  const activeControlUnits = controlUnits?.filter(isNotArchived)

  if (!activeControlUnits) {
    return []
  }

  const filters = getFilters(activeControlUnits, filtersState, cacheKey)

  return filters.reduce((previousControlUnits, filter) => filter(previousControlUnits), activeControlUnits)
}
