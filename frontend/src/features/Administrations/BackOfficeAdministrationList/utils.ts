import { CustomSearch, type Filter } from '@mtes-mct/monitor-ui'

import type { FiltersState } from './types'
import type { Administration } from '../../../domain/entities/administration'

export function getFilters(
  data: Administration.Administration[],
  filtersState: FiltersState
): Filter<Administration.Administration>[] {
  const customSearch = new CustomSearch(data, ['name'], {
    cacheKey: 'BACK_OFFICE_ADMINISTRATION_LIST',
    isStrict: true
  })
  const filters: Array<Filter<Administration.Administration>> = []

  if (filtersState.query && filtersState.query.trim().length > 0) {
    const filter: Filter<Administration.Administration> = () => customSearch.find(filtersState.query as string)

    filters.push(filter)
  }

  return filters
}
