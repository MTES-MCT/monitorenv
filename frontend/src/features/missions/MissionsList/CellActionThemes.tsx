/* eslint-disable react/jsx-props-no-spreading */
import { useMemo } from 'react'

import {
  ActionTypeEnum,
  type EnvAction,
  type EnvActionControl,
  type EnvActionSurveillance
} from '../../../domain/entities/missions'

const getAllThemesAndSubThemesAsString = (envactions: EnvAction[]) => {
  const uniqueThemesAndSubthemes = envactions
    .filter(
      (a): a is EnvActionControl | EnvActionSurveillance =>
        a.actionType === ActionTypeEnum.CONTROL || a.actionType === ActionTypeEnum.SURVEILLANCE
    )
    .reduce((acc, { themes }) => {
      if (themes) {
        themes.forEach(t => {
          if (!!t.theme && !acc[t.theme]) {
            acc[t.theme] = []
          }
          if (t.subThemes) {
            t.subThemes.forEach(st => {
              if (!!st && !acc[t.theme].includes(st)) {
                acc[t.theme].push(st)
              }
            })
          }
        })
      }

      return acc
    }, {})

  const getThemeAndSubThemesString = ([theme, subThemes]) => `${theme} : ${subThemes.join(' / ')}`

  return Object.entries(uniqueThemesAndSubthemes).map(getThemeAndSubThemesString).join(' ; ')
}

export function CellActionThemes({ envActions }: { envActions: EnvAction[] }) {
  const cellContent = useMemo(() => getAllThemesAndSubThemesAsString(envActions), [envActions])

  return cellContent !== '' ? (
    <span data-cy="cell-envactions-themes" title={cellContent}>
      {cellContent}
    </span>
  ) : null
}
