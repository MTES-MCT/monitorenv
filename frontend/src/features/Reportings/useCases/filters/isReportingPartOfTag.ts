import type { Reporting } from 'domain/entities/reporting'
import type { TagOption } from 'domain/entities/tags'

export function isReportingPartOfTag(reporting: Reporting, tagsFilter: TagOption[] | undefined) {
  if (!tagsFilter || tagsFilter.length === 0) {
    return true
  }

  const allTags = [...reporting.tags, ...reporting.tags.flatMap(({ subTags }) => subTags)]

  return tagsFilter.some(tagFilter => allTags.some(tag => tag.id === tagFilter.id))
}
