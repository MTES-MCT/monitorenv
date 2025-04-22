import { displaySubThemes } from '@features/Themes/utils/getThemesAsOptions'
import {
  ActionTypeEnum,
  type EnvAction,
  type EnvActionControl,
  type EnvActionSurveillance
} from 'domain/entities/missions'
import { useMemo } from 'react'
import styled from 'styled-components'

import type { ThemeAPI } from 'domain/entities/themes'

const getThemesCell = (envActions: EnvAction[]) => {
  const groupedThemes = envActions
    .filter(
      (a): a is EnvActionControl | EnvActionSurveillance =>
        a.actionType === ActionTypeEnum.CONTROL || a.actionType === ActionTypeEnum.SURVEILLANCE
    )
    .reduce<{ [key: number]: ThemeAPI }>((acc, envAction) => {
      envAction.themes?.forEach(theme => {
        if (!acc[theme.id]) {
          acc[theme.id] = { ...theme, subThemes: [] }
        }
        acc[theme.id]?.subThemes.push(...theme.subThemes)
      })

      return acc
    }, {})

  const toThemeCell = (theme: ThemeAPI) => ({
    component: (
      <>
        <>
          {theme.name} <SubThemesContainer>({displaySubThemes([theme])})</SubThemesContainer>
        </>
      </>
    ),
    title: `${theme.name} (${theme.subThemes.map(subTheme => subTheme.name).join(', ')})`
  })

  return Object.values(groupedThemes).flatMap(theme => toThemeCell(theme))
}

export function CellActionThemes({ envActions }: { envActions: EnvAction[] }) {
  const cellContent = useMemo(() => getThemesCell(envActions), [envActions])
  const cellTitle = useMemo(() => cellContent.map(content => content.title).join(' - '), [cellContent])

  return cellContent?.length > 0
    ? cellContent.map(({ component, title }, index) => (
        <ThemesAndSubThemesContainer key={title} data-cy="cell-envActions-themes" title={cellTitle}>
          {component}
          {index < cellContent.length - 1 ? ' - ' : ''}
        </ThemesAndSubThemesContainer>
      ))
    : null
}

const ThemesAndSubThemesContainer = styled.span`
  color: ${p => p.theme.color.charcoal};
  font-weight: 500;
`
const SubThemesContainer = styled.span`
  color: ${p => p.theme.color.slateGray};
  font-weight: 400;
`
