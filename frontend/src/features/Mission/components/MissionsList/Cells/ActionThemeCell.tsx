import { SubThemesOrSubTagsContainer, ThemesOrTagsContainer } from '@components/Table/style'
import { UNKNOWN } from '@components/Table/TableWithSelectableRows/utils'
import { displaySubThemes } from '@utils/getThemesAsOptions'
import {
  ActionTypeEnum,
  type EnvAction,
  type EnvActionControl,
  type EnvActionSurveillance
} from 'domain/entities/missions'
import { useMemo } from 'react'

import type { ThemeFromAPI } from 'domain/entities/themes'

const getThemesCell = (envActions: EnvAction[]) => {
  const groupedThemes = envActions
    .filter(
      (a): a is EnvActionControl | EnvActionSurveillance =>
        a.actionType === ActionTypeEnum.CONTROL || a.actionType === ActionTypeEnum.SURVEILLANCE
    )
    .reduce<{ [key: number]: ThemeFromAPI }>((acc, envAction) => {
      envAction.themes?.forEach(theme => {
        if (!acc[theme.id]) {
          acc[theme.id] = { ...theme, subThemes: [] }
        }
        acc[theme.id]?.subThemes.push(...theme.subThemes)
      })

      return acc
    }, {})

  const toThemeCell = (theme: ThemeFromAPI) => {
    const subThemes = displaySubThemes([theme])

    return {
      component: (
        <>
          {theme.name}{' '}
          {subThemes && subThemes.length > 0 && (
            <SubThemesOrSubTagsContainer>({subThemes})</SubThemesOrSubTagsContainer>
          )}
        </>
      ),
      title: `${theme.name} ${subThemes && subThemes.length > 0 ? `(${subThemes})` : ''}`
    }
  }

  return Object.values(groupedThemes).flatMap(theme => toThemeCell(theme))
}

export function ActionThemeCell({ envActions }: { envActions: EnvAction[] }) {
  const cellContent = useMemo(() => getThemesCell(envActions), [envActions])
  const title = cellContent[0]?.title
  const component = cellContent[0]?.component

  return component ? (
    <ThemesOrTagsContainer key={title} data-cy="cell-envActions-theme" title={title}>
      {component}
    </ThemesOrTagsContainer>
  ) : (
    UNKNOWN
  )
}
