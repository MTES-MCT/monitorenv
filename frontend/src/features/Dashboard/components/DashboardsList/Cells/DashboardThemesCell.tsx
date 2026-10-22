import { SubThemesOrSubTagsContainer, ThemesOrTagsContainer } from '@components/Table/style'

import type { ThemeFromAPI } from '../../../../../domain/entities/themes'

export function DashboardThemesCell({ themes }: { themes?: ThemeFromAPI[] }) {
  if (!themes || themes.length === 0) {
    return '-'
  }

  const groupedThemesAndSubThemes = themes.reduce(
    (acc, theme) => {
      if (theme) {
        const mainTheme = theme.name
        const subThemes = theme.subThemes?.map(subTheme => subTheme.name) ?? []

        if (!acc[mainTheme]) {
          acc[mainTheme] = []
        }
        if (subThemes) {
          subThemes.forEach(subTheme => {
            if (!acc[mainTheme]?.includes(subTheme)) {
              acc[mainTheme]?.push(subTheme)
            }
          })
        }
      }

      return acc
    },
    {} as Record<string, string[]>
  )

  const themesAndSubThemes = Object.entries(groupedThemesAndSubThemes)
  const title = Object.entries(groupedThemesAndSubThemes)
    .flatMap(([theme, subThemes]) => `${theme}${subThemes.length > 0 ? `: ${subThemes.join(', ')}` : ''}`)
    .join(' - ')

  return (
    <>
      {themesAndSubThemes.map(([mainTheme, subThemes], index) => (
        <ThemesOrTagsContainer key={mainTheme} title={title}>
          {mainTheme}
          {subThemes.length > 0 ? (
            <SubThemesOrSubTagsContainer>{` (${subThemes.join(', ')})`}</SubThemesOrSubTagsContainer>
          ) : (
            ''
          )}
          {index < themesAndSubThemes.length - 1 ? ' - ' : ''}
        </ThemesOrTagsContainer>
      ))}
    </>
  )
}
