import { CustomSearch, type Filter } from '@mtes-mct/monitor-ui'

import type { FiltersState } from './types'
import type { ControlUnit } from '../../../domain/entities/controlUnit'

export function getFilters(
  data: ControlUnit.ControlUnit[],
  filtersState: FiltersState
): Filter<ControlUnit.ControlUnit>[] {
  const customSearch = new CustomSearch(data, ['administration.name', 'name'], {
    cacheKey: 'BACK_OFFICE_CONTROL_UNIT_LIST',
    isStrict: true
  })
  const filters: Array<Filter<ControlUnit.ControlUnit>> = []

  if (filtersState.query && filtersState.query.trim().length > 0) {
    const filter: Filter<ControlUnit.ControlUnit> = () => customSearch.find(filtersState.query as string)

    filters.push(filter)
  }

  return filters
}
