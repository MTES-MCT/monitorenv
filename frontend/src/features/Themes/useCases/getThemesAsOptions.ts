import type { CheckTreePickerOption, Option } from '@mtes-mct/monitor-ui'
import type { ThemeAPI } from 'domain/entities/themes'

export const getThemesAsOptions = (themes: ThemeAPI[], childrenKey: string = 'subThemes'): CheckTreePickerOption[] =>
  themes
    .map(theme => {
      const subThemes =
        theme.subThemes.length === 0
          ? undefined
          : {
              [childrenKey]: theme.subThemes
                .map(({ id, name }) => ({ label: name, value: id }))
                .sort((a, b) => a.label.localeCompare(b.label))
            }

      return {
        ...subThemes,
        label: theme.name,
        value: theme.id
      }
    })
    .sort((a, b) => a.label.localeCompare(b.label))

export const getThemesAsOptionsCheckPicker = (themes: ThemeAPI[]): Option<number>[] =>
  themes.map(theme => ({ label: theme.name, value: theme.id })).sort((a, b) => a.label.localeCompare(b.label))

export const parseOptionsToThemes = (options: CheckTreePickerOption[], childrenKey: string = 'subThemes'): ThemeAPI[] =>
  options.map(option => ({
    id: +option.value,
    name: option.label,
    subThemes: (option[childrenKey] ?? []).map((child: CheckTreePickerOption) => ({
      id: child.value,
      name: child.label
    }))
  }))

export const filterSubThemes = (theme: ThemeAPI, toDeleteId: number): ThemeAPI | undefined => {
  if (theme.subThemes.length === 1) {
    return undefined
  }

  return {
    ...theme,
    subThemes: theme.subThemes.filter(subTheme => subTheme.id !== toDeleteId)
  }
}
