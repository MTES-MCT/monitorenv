import { CustomSearch, type Filter } from '@mtes-mct/monitor-ui'

import type { FiltersState } from './types'
import type { TagFromAPI } from '../../../../domain/entities/tags'

export function getFilters(data: TagFromAPI[], filtersState: FiltersState): Filter<TagFromAPI>[] {
  const customSearch = new CustomSearch(data, ['name', 'subTags.name'], {
    cacheKey: 'BACK_OFFICE_TAG_LIST',
    isStrict: true,
    withCacheInvalidation: true
  })
  const filters: Array<Filter<TagFromAPI>> = []

  if (filtersState.query && filtersState.query.trim().length > 0) {
    const filter: Filter<TagFromAPI> = () => customSearch.find(filtersState.query as string)

    filters.push(filter)
  }

  return filters
}
