import type { VigilanceArea } from '@features/VigilanceArea/types'
import type { TagOption } from 'domain/entities/tags'

export function isVigilanceAreaPartOfTag(vigilanceArea: VigilanceArea.VigilanceArea, tagsFilter: TagOption[]): boolean {
  if (!tagsFilter || tagsFilter.length === 0) {
    return true
  }

  const vigilanceAreaTagsWithoutChildren = vigilanceArea.tags
    ? [...vigilanceArea.tags.filter(tag => tag.subTags?.length === 0)]
    : []
  const vigilanceAreaSubTags = vigilanceArea.tags ? [...vigilanceArea.tags.flatMap(({ subTags }) => subTags)] : []

  const allTagsWithoutChildrenFilter = [...tagsFilter.filter(tagFilter => tagFilter?.subTags?.length === 0)]
  const allSubTagsFilter = tagsFilter.flatMap(tagFilter => tagFilter?.subTags || [])

  const hasMatchingSubTags = allSubTagsFilter.some(tagFilter =>
    vigilanceAreaSubTags.some(subTag => subTag.id === tagFilter.id)
  )

  let hasMatchingTags = false
  if (vigilanceAreaTagsWithoutChildren.length > 0) {
    hasMatchingTags = allTagsWithoutChildrenFilter.some(tagFilter =>
      vigilanceAreaTagsWithoutChildren.some(tag => tag.id === tagFilter.id)
    )
  }

  return hasMatchingTags || hasMatchingSubTags
}
