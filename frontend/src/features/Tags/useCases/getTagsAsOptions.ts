import type { TagAPI } from 'domain/entities/tags'

export const getTagsAsOptions = (
  themes: TagAPI[]
): { children: { label: string; value: string }[]; label: string; value: string }[] =>
  themes
    .map(theme => ({
      children: theme.subTags
        .map(subTheme => ({ label: subTheme.name, value: subTheme.name }))
        .sort((a, b) => a.label.localeCompare(b.label)),
      label: theme.name,
      value: theme.name
    }))
    .sort((a, b) => a.label.localeCompare(b.label))
