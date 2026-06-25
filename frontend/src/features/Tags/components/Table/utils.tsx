import { customDayjs, CustomSearch, type Filter } from '@mtes-mct/monitor-ui'

import type { FiltersState } from './types'
import type { TagTable } from '../../../../domain/entities/tags'

export function getFilters(data: TagTable[], filtersState: FiltersState): Filter<TagTable>[] {
  const customSearch = new CustomSearch(data, ['name', 'subTags.name'], {
    cacheKey: 'BACK_OFFICE_TAG_LIST',
    isStrict: true,
    withCacheInvalidation: true
  })
  const filters: Array<Filter<TagTable>> = []

  if (filtersState.query && filtersState.query.trim().length > 0) {
    const query: Filter<TagTable> = () => customSearch.find(filtersState.query as string)

    filters.push(query)
  }

  if (filtersState.validity) {
    const isValid: Filter<TagTable> = tags => {
      const now = customDayjs()
      if (filtersState.validity === 'IN_PROGRESS') {
        return tags.filter(
          tag =>
            !tag.id ||
            (tag.startedAt &&
              now.isAfter(customDayjs(tag.startedAt)) &&
              (!tag.endedAt || now.isBetween(customDayjs(tag.startedAt), customDayjs(tag.endedAt))))
        )
      }
      if (filtersState.validity === 'OUTDATED') {
        return tags.filter(tag => !tag.id || (tag.startedAt && tag.endedAt && now.isAfter(customDayjs(tag.endedAt))))
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

function isValidTagStartedAt(value?: string) {
  return !!value
}

function isValidTagEndededAt(value?: string, pastDate?: string) {
  return !(value && pastDate && customDayjs(value).isBefore(customDayjs(pastDate)))
}

export function validate(columnId: string, value: string, pastDate?: string): string {
  if (columnId === 'name') {
    if (!isValidTagName(value)) {
      return 'Le nom est requis'
    }
  }
  if (columnId === 'startedAt') {
    if (!isValidTagStartedAt(value)) {
      return 'La date de début est requise'
    }
  }
  if (columnId === 'endedAt') {
    if (!isValidTagEndededAt(value, pastDate)) {
      return 'La date de fin doit être supérieure à la date de début'
    }
  }

  return ''
}

export function isTagValid(tag: TagTable) {
  return (
    isValidTagName(tag.name) && isValidTagStartedAt(tag.startedAt) && isValidTagEndededAt(tag.endedAt, tag.startedAt)
  )
}
