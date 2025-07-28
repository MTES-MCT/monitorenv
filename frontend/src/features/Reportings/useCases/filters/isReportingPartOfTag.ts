import { isPartOfTags } from '@utils/isPartOfTags'

import type { Reporting } from 'domain/entities/reporting'
import type { TagOption } from 'domain/entities/tags'

export function isReportingPartOfTag(reporting: Reporting, tagsFilter: TagOption[] | undefined) {
  if (!tagsFilter || tagsFilter.length === 0) {
    return true
  }

  return isPartOfTags({
    filterTags: tagsFilter,
    tagsToCompare: reporting.tags || []
  })
}
