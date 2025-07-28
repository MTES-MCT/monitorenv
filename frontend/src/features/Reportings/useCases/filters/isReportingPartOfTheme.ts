import { isPartOfThemes } from '@utils/isPartOfThemes'

import type { Reporting } from 'domain/entities/reporting'
import type { ThemeOption } from 'domain/entities/themes'

export function isReportingPartOfTheme(reporting: Reporting, themesFilter: ThemeOption[] | undefined) {
  if (!themesFilter || themesFilter.length === 0) {
    return true
  }

  return isPartOfThemes({
    filterThemes: themesFilter,
    themesToCompare: reporting.theme ? [reporting.theme] : []
  })
}
