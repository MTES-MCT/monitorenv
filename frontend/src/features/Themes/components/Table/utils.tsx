import { customDayjs, CustomSearch, type Filter } from '@mtes-mct/monitor-ui'

import type { FiltersState } from './types'
import type { ThemeTable } from 'domain/entities/themes'

function isThemeInProgress(theme: ThemeTable) {
  const now = customDayjs()

  return (
    !theme.id ||
    (theme.startedAt &&
      now.isAfter(customDayjs(theme.startedAt)) &&
      (!theme.endedAt || now.isBetween(customDayjs(theme.startedAt), customDayjs(theme.endedAt))))
  )
}

function isThemeOutOfValidity(theme: ThemeTable) {
  const now = customDayjs()

  return !theme.id || (theme.startedAt && theme.endedAt && now.isAfter(customDayjs(theme.endedAt)))
}

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
      if (filtersState.validity === 'IN_PROGRESS') {
        return themes
          .filter(theme => isThemeInProgress(theme))
          .map(theme => ({ ...theme, subThemes: theme.subThemes.filter(subTheme => isThemeInProgress(subTheme)) }))
      }
      if (filtersState.validity === 'OUTDATED') {
        return themes
          .filter(theme => isThemeOutOfValidity(theme))
          .map(theme => ({ ...theme, subThemes: theme.subThemes.filter(subTheme => isThemeOutOfValidity(subTheme)) }))
      }

      return themes
    }

    filters.push(isValid)
  }

  return filters
}
