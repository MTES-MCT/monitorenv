import { SubThemesOrSubTagsContainer, ThemesOrTagsContainer } from '@components/Table/style'
import { UNKNOWN } from '@components/Table/TableWithSelectableRows/utils'
import { displaySubThemes } from '@utils/getThemesAsOptions'
import { useMemo } from 'react'

import type { ThemeFromAPI } from 'domain/entities/themes'

const getThemesCell = (themes: ThemeFromAPI[], asDetails: boolean) => {
  const toThemeCell = (theme: ThemeFromAPI, isLast: boolean) => {
    const subThemes = displaySubThemes([theme])

    return {
      component: (
        <>
          {theme.name}
          {!asDetails && !isLast ? ', ' : ' '}
          {asDetails && subThemes && subThemes.length > 0 && (
            <SubThemesOrSubTagsContainer>({subThemes})</SubThemesOrSubTagsContainer>
          )}
        </>
      ),
      title: `${theme.name} ${asDetails && subThemes && subThemes.length > 0 ? `(${subThemes})` : ''}`
    }
  }

  return themes.map((theme, index) => toThemeCell(theme, index === themes.length - 1))
}

export function ThemesCell({ asDetails, themes }: { asDetails: boolean; themes: ThemeFromAPI[] }) {
  const cellContent = useMemo(() => getThemesCell(themes, asDetails), [themes, asDetails])
  const cellTitle = useMemo(() => cellContent.map(content => content.title).join(' - '), [cellContent])

  return cellContent?.length > 0 ? (
    <>
      {cellContent.map(({ component, title }) => (
        <ThemesOrTagsContainer
          key={title}
          as={asDetails ? 'li' : 'span'}
          data-cy="cell-envActions-themes"
          title={cellTitle}
        >
          {component}
        </ThemesOrTagsContainer>
      ))}
    </>
  ) : (
    UNKNOWN
  )
}
