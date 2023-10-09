import { CustomSearch, type Filter } from '@mtes-mct/monitor-ui'

import type { FiltersState } from './types'
import type { Base } from '../../../../domain/entities/base'

export function getFilters(data: Base.Base[], filtersState: FiltersState): Filter<Base.Base>[] {
  const customSearch = new CustomSearch(data, ['name'], {
    cacheKey: 'BACK_OFFICE_BASE_LIST',
    isStrict: true
  })
  const filters: Array<Filter<Base.Base>> = []

  if (filtersState.query && filtersState.query.trim().length > 0) {
    const filter: Filter<Base.Base> = () => customSearch.find(filtersState.query as string)

    filters.push(filter)
  }

  return filters
}
