import styled from 'styled-components'

import type { ThemeFromAPI } from 'domain/entities/themes'

export function ThemesDetailsCell({ themes }: { themes?: ThemeFromAPI[] }) {
  if (!themes || themes.length === 0) {
    return <span>-</span>
  }

  const formattedThemes = themes.map(theme => ({
    id: theme.id,
    name: theme.name,
    subThemes: theme.subThemes.map(subTheme => subTheme.name).join(', ')
  }))

  return (
    <>
      {formattedThemes.map(theme => (
        <div key={theme.id}>
          <ThemeText>{theme.name}</ThemeText>
          {theme.subThemes && <SubThemesText>({theme.subThemes})</SubThemesText>}
        </div>
      ))}
    </>
  )
}

const ThemeText = styled.span``

const SubThemesText = styled.div`
  color: ${p => p.theme.color.slateGray};
`
