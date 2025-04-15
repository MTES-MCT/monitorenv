import type { Option } from '@mtes-mct/monitor-ui'
import type { CheckTreePickerOption } from '@mtes-mct/monitor-ui__root'
import type { ThemeAPI } from 'domain/entities/themes'

export const getThemesAsOptions = (themes: ThemeAPI[], childrenKey: string = 'subThemes'): CheckTreePickerOption[] =>
  themes
    .map(theme => ({
      [childrenKey]: theme.subThemes
        .map(subTheme => ({ label: subTheme.name, value: subTheme.id }))
        .sort((a, b) => a.label.localeCompare(b.label)),
      label: theme.name,
      value: theme.id
    }))
    .sort((a, b) => a.label.localeCompare(b.label))

export const getThemesAsOptionsCheckPicker = (themes: ThemeAPI[]): Option<number>[] =>
  themes.map(theme => ({ label: theme.name, value: theme.id })).sort((a, b) => a.label.localeCompare(b.label))

export const parseOptionToTheme = (options: CheckTreePickerOption[], childrenKey: string = 'subThemes'): ThemeAPI[] =>
  options.map(option => ({
    id: +option.value,
    name: option.label,
    subThemes: (option[childrenKey] ?? []).map((child: CheckTreePickerOption) => ({
      id: child.value,
      name: child.label
    }))
  }))
