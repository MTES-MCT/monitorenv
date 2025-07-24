import type { Reporting } from 'domain/entities/reporting'
import type { TagOption } from 'domain/entities/tags'

export function isReportingPartOfTag(reporting: Reporting, tagsFilter: TagOption[] | undefined) {
  if (!tagsFilter || tagsFilter.length === 0) {
    return true
  }

  const reportingTagsWithoutChildren = [...reporting.tags.filter(tag => tag.subTags?.length === 0)]
  const reportingSubTags = [...reporting.tags.flatMap(({ subTags }) => subTags)]

  const allTagsWithoutChildrenFilter = [...tagsFilter.filter(tagFilter => tagFilter?.subTags?.length === 0)]
  const allSubTagsFilter = tagsFilter.flatMap(tagFilter => tagFilter?.subTags || [])

  const hasMatchingSubTags = allSubTagsFilter.some(tagFilter =>
    reportingSubTags.some(subTag => subTag.id === tagFilter.id)
  )

  let hasMatchingTags = false
  if (reportingTagsWithoutChildren.length > 0) {
    hasMatchingTags = allTagsWithoutChildrenFilter.some(tagFilter =>
      reportingTagsWithoutChildren.some(tag => tag.id === tagFilter.id)
    )
  }

  return hasMatchingTags || hasMatchingSubTags
}
