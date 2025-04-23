import type { CheckTreePickerOption } from '@mtes-mct/monitor-ui'
import type { TagFromAPI } from 'domain/entities/tags'

export const getTagsAsOptions = (tags: TagFromAPI[], childrenKey: string = 'subTags'): CheckTreePickerOption[] =>
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

export const getTagsAsOptionsLegacy = (tags: TagFromAPI[], childrenKey: string = 'subTags'): CheckTreePickerOption[] =>
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

export const parseOptionsToTags = (options: CheckTreePickerOption[], childrenKey: string = 'subTags'): TagFromAPI[] =>
  options.map(option => ({
    id: +option.value,
    name: option.label,
    subTags: (option[childrenKey] ?? []).map((child: CheckTreePickerOption) => ({
      id: child.value,
      name: child.label
    }))
  }))

export const filterSubTags = (tag: TagFromAPI, tagToFilter: TagFromAPI): TagFromAPI | undefined => {
  if (tag.subTags.length === 1) {
    return undefined
  }

  return {
    ...tag,
    subTags: tag.subTags.filter(subTag => subTag.id !== tagToFilter.id)
  }
}

export const displayTags = (tags?: TagFromAPI[]) => tags?.map(({ name }) => name).join(', ')

export const displaySubTags = (tags?: TagFromAPI[]) =>
  tags?.flatMap(({ subTags }) => subTags.map(({ name }) => name)).join(', ')
