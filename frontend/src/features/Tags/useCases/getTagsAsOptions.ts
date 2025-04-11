import type { CheckTreePickerOption } from '@mtes-mct/monitor-ui__root'
import type { TagAPI } from 'domain/entities/tags'

export const getTagsAsOptions = (tags: TagAPI[], childrenKey: string = 'subTags'): CheckTreePickerOption[] =>
  tags
    .map(tag => ({
      [childrenKey]: tag.subTags
        .map(({ name }) => ({ label: name, value: name }))
        .sort((a, b) => a.label.localeCompare(b.label)),
      label: tag.name,
      value: tag.name
    }))
    .sort((a, b) => a.label.localeCompare(b.label))
