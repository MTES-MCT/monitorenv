import { customDayjs, CustomSearch, type Filter } from '@mtes-mct/monitor-ui'

import type { FiltersState } from './types'
import type { ThemeTable } from 'domain/entities/themes'

export function getFilters(data: ThemeTable[], filtersState: FiltersState): Filter<ThemeTable>[] {
  const customSearch = new CustomSearch(data, ['name', 'subThemes.name'], {
    cacheKey: 'BACK_OFFICE_THEME_LIST',
    isStrict: true,
    withCacheInvalidation: true
  })
  const filters: Array<Filter<ThemeTable>> = []

  if (filtersState.query && filtersState.query.trim().length > 0) {
    const query: Filter<ThemeTable> = () => customSearch.find(filtersState.query as string)

    filters.push(query)
  }

  if (filtersState.validity) {
    const isValid: Filter<ThemeTable> = themes => {
      const now = customDayjs()
      if (filtersState.validity === 'IN_PROGRESS') {
        return themes.filter(
          theme =>
            !theme.id ||
            (theme.startedAt &&
              now.isAfter(customDayjs(theme.startedAt)) &&
              (!theme.endedAt || now.isBetween(customDayjs(theme.startedAt), customDayjs(theme.endedAt))))
        )
      }
      if (filtersState.validity === 'OUTDATED') {
        return themes.filter(
          theme => !theme.id || (theme.startedAt && theme.endedAt && now.isAfter(customDayjs(theme.endedAt)))
        )
      }

      return themes
    }

    filters.push(isValid)
  }

  return filters
}
