import type { Option } from '@mtes-mct/monitor-ui'
import type { ThemeFromAPI, ThemeOption } from 'domain/entities/themes'

export const getThemesAsOptions = (themes: ThemeFromAPI[], childrenKey: string = 'subThemes'): ThemeOption[] =>
  themes
    .map(theme => {
      const subThemes =
        theme.subThemes.length === 0
          ? undefined
          : {
              [childrenKey]:
                theme.subThemes.length === 0
                  ? undefined
                  : theme.subThemes.map(({ id, name }) => ({ id, name })).sort((a, b) => a.name.localeCompare(b.name))
            }

      return {
        ...subThemes,
        id: theme.id,
        name: theme.name
      }
    })
    .sort((a, b) => a.name.localeCompare(b.name))

export const getThemesAsOptionsCheckPicker = (themes: ThemeFromAPI[]): Option<number>[] =>
  themes.map(theme => ({ label: theme.name, value: theme.id })).sort((a, b) => a.label.localeCompare(b.label))

export const parseOptionsToThemes = (
  options: ThemeOption[] | undefined,
  childrenKey = 'subThemes',
  valueKey = 'id',
  labelKey = 'name'
): ThemeFromAPI[] | undefined =>
  options?.map(option => ({
    id: option[valueKey],
    name: option[labelKey],
    subThemes: (option[childrenKey] ?? []).map((child: ThemeOption) => ({
      id: child[valueKey],
      name: child[labelKey]
    }))
  }))

export const filterSubThemes = (theme: ThemeOption, themeToFilter: ThemeOption): ThemeOption | undefined => {
  if (theme.subThemes?.length === 1) {
    return undefined
  }

  return {
    ...theme,
    subThemes: theme.subThemes?.filter(subTheme => subTheme.id !== themeToFilter.id)
  }
}

export const displayThemes = (themes?: ThemeFromAPI[]) => themes?.map(({ name }) => name).join(', ')

export const displaySubThemes = (themes?: ThemeFromAPI[]) =>
  themes?.flatMap(({ subThemes }) => subThemes.map(({ name }) => name)).join(', ')

export const sortThemes = (a: ThemeOption, b: ThemeOption) => {
  if (a.name.startsWith('Autre')) {
    return 1
  }
  if (b.name.startsWith('Autre')) {
    return -1
  }

  return a?.name.localeCompare(b?.name)
}
