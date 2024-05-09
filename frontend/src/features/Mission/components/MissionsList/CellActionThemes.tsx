import { Mission } from '@features/Mission/mission.type'
import { useMemo } from 'react'

import { useGetControlPlans } from '../../../../hooks/useGetControlPlans'

import type {
  ControlPlansSubThemeCollection,
  ControlPlansThemeCollection
} from '../../../../domain/entities/controlPlan'

const getAllThemesAndSubThemesAsString = (
  envActions: Mission.EnvAction[],
  subThemes: ControlPlansSubThemeCollection,
  themes: ControlPlansThemeCollection
) => {
  const uniqueThemesAndSubthemes = envActions
    .filter(
      (a): a is Mission.EnvActionControl | Mission.EnvActionSurveillance =>
        a.actionType === Mission.ActionTypeEnum.CONTROL || a.actionType === Mission.ActionTypeEnum.SURVEILLANCE
    )
    .reduce((acc, { controlPlans }) => {
      if (controlPlans) {
        controlPlans.forEach(controlPlan => {
          const controlPlanTheme = controlPlan.themeId ? themes[controlPlan.themeId]?.theme : undefined
          if (controlPlanTheme && !acc[controlPlanTheme]) {
            acc[controlPlanTheme] = []
          }
          if (controlPlan.subThemeIds) {
            controlPlan.subThemeIds.forEach(subThemeId => {
              const controlPlanSubTheme = subThemes[subThemeId]?.subTheme
              if (controlPlanTheme && controlPlanSubTheme && !acc[controlPlanTheme].includes(controlPlanSubTheme)) {
                acc[controlPlanTheme].push(controlPlanSubTheme)
              }
            })
          }
        })
      }

      return acc
    }, {})

  const getThemeAndSubThemesString = ([theme, subThemesAsString]) => `${theme}  (${subThemesAsString?.join(', ')})`

  return Object.entries(uniqueThemesAndSubthemes).map(getThemeAndSubThemesString).join(' - ')
}

export function CellActionThemes({ envActions }: { envActions: Mission.EnvAction[] }) {
  const { subThemes, themes } = useGetControlPlans()
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
