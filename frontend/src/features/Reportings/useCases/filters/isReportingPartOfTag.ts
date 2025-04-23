import type { Reporting } from 'domain/entities/reporting'
import type { TagAPI } from 'domain/entities/tags'

export function isReportingPartOfTag(reporting: Reporting, tagsFilter: TagAPI[] | undefined) {
  if (!tagsFilter || tagsFilter.length === 0) {
    return true
  }

  const allTags = [...reporting.tags, ...reporting.tags.flatMap(({ subTags }) => subTags)]

  return tagsFilter.some(tagFilter => allTags.some(tag => tag.id === tagFilter.id))
}
