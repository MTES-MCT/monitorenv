import type { ThemeAPI } from 'domain/entities/themes'

export const getThemesAsOptions = (
  themes: ThemeAPI[]
): { children: { label: string; value: string }[]; label: string; value: string }[] =>
  themes
    .map(theme => ({
      children: theme.subThemes
        .map(subTheme => ({ label: subTheme.name, value: subTheme.name }))
        .sort((a, b) => a.label.localeCompare(b.label)),
      label: theme.name,
      value: theme.name
    }))
    .sort((a, b) => a.label.localeCompare(b.label))
