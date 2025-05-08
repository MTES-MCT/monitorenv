import type { CheckTreePickerOption } from '@mtes-mct/monitor-ui'
import type { TagFromAPI, TagOption } from 'domain/entities/tags'

export const getTagsAsOptions = (tags: TagFromAPI[], childrenKey: string = 'subTags'): TagOption[] =>
  tags
    .map(tag => {
      const subTags =
        tag.subTags.length === 0
          ? undefined
          : {
              [childrenKey]:
                tag.subTags.length === 0
                  ? undefined
                  : tag.subTags.map(({ id, name }) => ({ id, name })).sort((a, b) => a.name.localeCompare(b.name))
            }

      return {
        ...subTags,
        id: tag.id,
        name: tag.name
      }
    })
    .sort((a, b) => a.name.localeCompare(b.name))

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

export const parseOptionsToTags = (
  options: TagOption[] | undefined,
  childrenKey = 'subTags',
  valueKey = 'id',
  labelKey = 'name'
): TagFromAPI[] | undefined =>
  options?.map(option => ({
    id: option[valueKey],
    name: option[labelKey],
    subTags: (option[childrenKey] ?? []).map((child: TagOption) => ({
      id: child[valueKey],
      name: child[labelKey]
    }))
  }))

export const filterSubTags = (tag: TagOption, tagToFilter: TagOption): TagOption | undefined => {
  if (tag.subTags?.length === 1) {
    return undefined
  }

  return {
    ...tag,
    subTags: tag.subTags?.filter(subTag => subTag.id !== tagToFilter.id)
  }
}

export const displayTags = (tags?: TagFromAPI[]) => tags?.map(({ name }) => name).join(', ')

export const displaySubTags = (tags?: TagFromAPI[]) =>
  tags?.flatMap(({ subTags }) => subTags.map(({ name }) => name)).join(', ')
