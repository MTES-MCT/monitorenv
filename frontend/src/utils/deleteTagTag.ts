import { filterSubTags } from './getTagsAsOptions'

import type { TagOption } from 'domain/entities/tags'

export function deleteTagTag(filter: TagOption[], valueToDelete: TagOption) {
  let updatedFilter: TagOption[] = [...filter]

  if (valueToDelete.subTags) {
    updatedFilter = filter.filter(tag => tag.id !== valueToDelete.id)
  } else {
    updatedFilter = filter
      .map(tag => filterSubTags(tag, valueToDelete))
      .filter(tag => tag !== undefined)
      .filter(tag => tag.id !== valueToDelete.id)
  }

  return updatedFilter
}
