import type { VigilanceArea } from '@features/VigilanceArea/types'
import type { TagAPI } from 'domain/entities/tags'

export function isVigilanceAreaPartOfTag(vigilanceArea: VigilanceArea.VigilanceArea, tagsFilter: TagAPI[]): boolean {
  if (!tagsFilter || tagsFilter.length === 0) {
    return true
  }

  const allTags = vigilanceArea.tags
    ? [...vigilanceArea.tags, ...vigilanceArea.tags.flatMap(({ subTags }) => subTags)]
    : []

  return tagsFilter.some(tagFilter => allTags.some(tag => tag.id === tagFilter.id))
}
