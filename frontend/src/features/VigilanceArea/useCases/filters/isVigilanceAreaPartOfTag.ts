import type { VigilanceArea } from '@features/VigilanceArea/types'
import type { TagAPI } from 'domain/entities/tags'

export function isVigilanceAreaPartOfTag(vigilanceArea: VigilanceArea.VigilanceArea, tagsFilter: TagAPI[]): boolean {
  if (!tagsFilter || tagsFilter.length === 0) {
    return true
  }

  return !!vigilanceArea.tags && vigilanceArea.tags?.some(tag => tagsFilter.some(tagFilter => tagFilter.id === tag.id))
}
