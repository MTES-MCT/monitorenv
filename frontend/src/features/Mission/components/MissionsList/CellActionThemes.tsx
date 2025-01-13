import { useGetControlPlans } from '@hooks/useGetControlPlans'
import {
  ActionTypeEnum,
  type EnvAction,
  type EnvActionControl,
  type EnvActionSurveillance
} from 'domain/entities/missions'
import { useMemo } from 'react'
import styled from 'styled-components'

import type { ControlPlansSubThemeCollection, ControlPlansThemeCollection } from 'domain/entities/controlPlan'

const getAllThemesAndSubThemesAsString = (
  envActions: EnvAction[],
  subThemes: ControlPlansSubThemeCollection,
  themes: ControlPlansThemeCollection
) => {
  const uniqueThemesAndSubthemes = envActions
    .filter(
      (a): a is EnvActionControl | EnvActionSurveillance =>
        a.actionType === ActionTypeEnum.CONTROL || a.actionType === ActionTypeEnum.SURVEILLANCE
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

  const getThemeAndSubThemesString = ([theme, subThemesAsString]) => ({
    component: (
      <>
        {theme} <SubThemesContainer>({subThemesAsString?.join(', ')})</SubThemesContainer>
      </>
    ),
    title: `${theme} (${subThemesAsString?.join(', ')})`
  })

  return Object.entries(uniqueThemesAndSubthemes).map(getThemeAndSubThemesString)
}

export function CellActionThemes({ envActions }: { envActions: EnvAction[] }) {
  const { subThemes, themes } = useGetControlPlans()
  const cellContent = useMemo(
    () => getAllThemesAndSubThemesAsString(envActions, subThemes, themes),
    [envActions, subThemes, themes]
  )
  const cellTitle = useMemo(() => cellContent?.map(content => content.title).join(' - '), [cellContent])

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
