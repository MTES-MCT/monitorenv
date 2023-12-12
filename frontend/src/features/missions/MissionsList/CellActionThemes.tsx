/* eslint-disable react/jsx-props-no-spreading */
import { useMemo } from 'react'

import {
  ActionTypeEnum,
  type EnvAction,
  type EnvActionControl,
  type EnvActionSurveillance
} from '../../../domain/entities/missions'

import type { ControlPlansSubTheme, ControlPlansTheme } from '../../../domain/entities/controlPlan'

const getAllThemesAndSubThemesAsString = (
  envActions: EnvAction[],
  subThemes: Array<ControlPlansSubTheme>,
  themes: Array<ControlPlansTheme>
) => {
  const uniqueThemesAndSubthemes = envActions
    .filter(
      (a): a is EnvActionControl | EnvActionSurveillance =>
        a.actionType === ActionTypeEnum.CONTROL || a.actionType === ActionTypeEnum.SURVEILLANCE
    )
    .reduce((acc, { controlPlans }) => {
      if (controlPlans) {
        controlPlans.forEach(controlPlan => {
          const controlPlanTheme = themes.find(theme => theme.id === controlPlan.themeId)?.theme
          if (controlPlanTheme && !acc[controlPlanTheme]) {
            acc[controlPlanTheme] = []
          }
          if (controlPlan.subThemeIds) {
            controlPlan.subThemeIds.forEach(subThemeId => {
              const controlPlanSubTheme = subThemes.find(subTheme => subTheme.id === subThemeId)?.subTheme
              if (controlPlanTheme && controlPlanSubTheme && !acc[controlPlanTheme].includes(controlPlanSubTheme)) {
                acc[controlPlanTheme].push(controlPlanSubTheme)
              }
            })
          }
        })
      }

      return acc
    }, {})

  const getThemeAndSubThemesString = ([theme, subThemesAsString]) => `${theme} : ${subThemesAsString?.join(' / ')}`

  return Object.entries(uniqueThemesAndSubthemes).map(getThemeAndSubThemesString).join(' ; ')
}

export function CellActionThemes({
  envActions,
  subThemes,
  themes
}: {
  envActions: EnvAction[]
  subThemes: Array<ControlPlansSubTheme>
  themes: Array<ControlPlansTheme>
}) {
  const cellContent = useMemo(
    () => getAllThemesAndSubThemesAsString(envActions, subThemes, themes),
    [envActions, subThemes, themes]
  )

  return cellContent !== '' ? (
    <span data-cy="cell-envActions-themes" title={cellContent}>
      {cellContent}
    </span>
  ) : null
}
