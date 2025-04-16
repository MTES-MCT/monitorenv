import type { CheckTreePickerOption } from '@mtes-mct/monitor-ui'
import type { TagAPI } from 'domain/entities/tags'

export const getTagsAsOptions = (tags: TagAPI[], childrenKey: string = 'subTags'): CheckTreePickerOption[] =>
  tags
    .map(tag => {
      const subTags =
        tag.subTags.length === 0
          ? undefined
          : {
              [childrenKey]: tag.subTags
                .map(({ id, name }) => ({ label: name, value: id }))
                .sort((a, b) => a.label.localeCompare(b.label))
            }

      return {
        ...subTags,
        label: tag.name,
        value: tag.id
      }
    })
    .sort((a, b) => a.label.localeCompare(b.label))

export const getTagsAsOptionsLegacy = (tags: TagAPI[], childrenKey: string = 'subTags'): CheckTreePickerOption[] =>
  tags
    .map(tag => ({
      [childrenKey]:
        tag.subTags.length === 0
          ? undefined
          : tag.subTags
              .map(({ name }) => ({ label: name, value: name }))
              .sort((a, b) => a.label.localeCompare(b.label)),
      label: tag.name,
      value: tag.name
    }))
    .sort((a, b) => a.label.localeCompare(b.label))

export const parseOptionsToTags = (options: CheckTreePickerOption[], childrenKey: string = 'subTags'): TagAPI[] =>
  options.map(option => ({
    id: +option.value,
    name: option.label,
    subTags: (option[childrenKey] ?? []).map((child: CheckTreePickerOption) => ({
      id: child.value,
      name: child.label
    }))
  }))

export const filterSubTags = (tag: TagAPI, toDeleteId: number): TagAPI | undefined => {
  if (tag.subTags.length === 1) {
    return undefined
  }

  return {
    ...tag,
    subTags: tag.subTags.filter(subTag => subTag.id !== toDeleteId)
  }
}
