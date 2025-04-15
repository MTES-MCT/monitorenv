import type { TagAPI } from 'domain/entities/tags'

export const getTagsAsOptions = (
  tags: TagAPI[]
): { children: { label: string; value: string }[]; label: string; value: string }[] =>
  tags
    .map(tag => ({
      children: tag.subTags
        .map(({ name }) => ({ label: name, value: name }))
        .sort((a, b) => a.label.localeCompare(b.label)),
      label: tag.name,
      value: tag.name
    }))
    .sort((a, b) => a.label.localeCompare(b.label))
