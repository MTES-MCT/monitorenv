import { CustomSearch, type Filter } from '@mtes-mct/monitor-ui'

import type { FiltersState } from './types'
import type { MissionTagTable } from '../../../../domain/entities/missionTags'

export function getFilters(data: MissionTagTable[], filtersState: FiltersState): Filter<MissionTagTable>[] {
  const customSearch = new CustomSearch(data, ['name'], {
    cacheKey: 'BACK_OFFICE_MISSION_TAG_LIST',
    isStrict: true,
    withCacheInvalidation: true
  })
  const filters: Array<Filter<MissionTagTable>> = []

  if (filtersState.query && filtersState.query.trim().length > 0) {
    const query: Filter<MissionTagTable> = () => customSearch.find(filtersState.query as string)

    filters.push(query)
  }

  if (filtersState.status) {
    const isValid: Filter<MissionTagTable> = tags => {
      if (filtersState.status === 'ARCHIVED') {
        return tags.filter(tag => tag.isArchived)
      }
      if (filtersState.status === 'ACTIVE') {
        return tags.filter(tag => !tag.isArchived)
      }

      return tags
    }

    filters.push(isValid)
  }

  return filters
}

function isValidTagName(value?: string) {
  return !!value && value.trim().length > 0
}

export function validate(columnId: string, value: string): string {
  if (columnId === 'name') {
    if (!isValidTagName(value)) {
      return 'Le nom est requis'
    }
  }

  return ''
}

export function isMissionTagValid(tag: MissionTagTable) {
  return isValidTagName(tag.name)
}
