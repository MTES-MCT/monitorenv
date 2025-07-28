import type { TagOption } from 'domain/entities/tags'

export function isPartOfTags({ filterTags, tagsToCompare }: { filterTags: TagOption[]; tagsToCompare: TagOption[] }) {
  const tagsToCompareWithoutChildren = [...tagsToCompare.filter(tag => tag.subTags?.length === 0)]
  const subTagsToCompare = [...tagsToCompare.flatMap(({ subTags }) => subTags)]

  const allTagsWithoutChildrenFilter = [...filterTags.filter(tagFilter => tagFilter?.subTags?.length === 0)]
  const allSubTagsFilter = filterTags.flatMap(tagFilter => tagFilter?.subTags || [])

  const hasMatchingSubTags = allSubTagsFilter.some(tagFilter =>
    subTagsToCompare.some(subTag => subTag?.id === tagFilter.id)
  )

  let hasMatchingTags = false
  if (tagsToCompareWithoutChildren.length > 0) {
    hasMatchingTags = allTagsWithoutChildrenFilter.some(tagFilter =>
      tagsToCompareWithoutChildren.some(tag => tag.id === tagFilter.id)
    )
  }

  return hasMatchingTags || hasMatchingSubTags
}
