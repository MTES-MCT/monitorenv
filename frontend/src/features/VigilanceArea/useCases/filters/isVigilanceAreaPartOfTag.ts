import { isPartOfTags } from '@utils/isPartOfTags'

import type { VigilanceArea } from '@features/VigilanceArea/types'
import type { TagOption } from 'domain/entities/tags'

export function isVigilanceAreaPartOfTag(vigilanceArea: VigilanceArea.VigilanceArea, tagsFilter: TagOption[]): boolean {
  if (!tagsFilter || tagsFilter.length === 0) {
    return true
  }

  return isPartOfTags({
    filterTags: tagsFilter,
    tagsToCompare: vigilanceArea.tags || []
  })
}
