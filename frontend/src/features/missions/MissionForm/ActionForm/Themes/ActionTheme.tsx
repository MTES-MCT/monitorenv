import { useField } from 'formik'
import { sortBy } from 'lodash/fp'
import { useMemo } from 'react'
import styled from 'styled-components'

import { TagsSelector } from './TagsSelector'
import { ThemeSelector } from './ThemeSelector'
import { SubThemesSelector } from './ThemeSelector/SubThemesSelector'
import { ActionTypeEnum } from '../../../../../domain/entities/missions'
import { useGetControlPlansByYear } from '../../../../../hooks/useGetControlPlansByYear'

import type { ControlPlansData } from '../../../../../domain/entities/controlPlan'

const GENERAL_SURVEILLANCE = 'Surveillance générale'

type ActionThemeProps = {
  actionIndex: number
  actionType: ActionTypeEnum
  labelSubTheme: string
  labelTheme: string
  themeIndex: number
  themesYear: number
}
export function ActionTheme({
  actionIndex,
  actionType,
  labelSubTheme,
  labelTheme,
  themeIndex,
  themesYear
}: ActionThemeProps) {
  const [actionControlPlansField] = useField<Array<ControlPlansData>>(`envActions[${actionIndex}].controlPlans`)
  const [currentThemeField] = useField<number>(`envActions[${actionIndex}].controlPlans[${themeIndex}].themeId`)

  const { isError, isLoading, subThemesByYearAsOptions, tagsByYearAsOptions, themesByYearAsOptions } =
    useGetControlPlansByYear({
      selectedTheme: currentThemeField?.value,
      year: themesYear
    })

  const formattedThemesAsOptions = useMemo(() => {
    if (actionType === ActionTypeEnum.CONTROL) {
      return sortBy(
        'label',
        themesByYearAsOptions?.filter(theme => theme.label !== GENERAL_SURVEILLANCE)
      )
    }

    return sortBy(
      'label',
      themesByYearAsOptions?.map(themeAsOption => ({
        isDisabled: actionControlPlansField.value.some(controlPlan => controlPlan.themeId === themeAsOption.value),
        label: themeAsOption.label,
        value: themeAsOption.value
      }))
    )
  }, [actionType, themesByYearAsOptions, actionControlPlansField.value])

  return (
    <ActionThemeWrapper data-cy="envaction-theme-element">
      <ThemeSelector
        actionIndex={actionIndex}
        isError={isError}
        isLoading={isLoading}
        label={labelTheme}
        themeIndex={themeIndex}
        themes={formattedThemesAsOptions}
      />
      <SubThemesSelector
        actionIndex={actionIndex}
        isError={isError}
        isLoading={isLoading}
        label={labelSubTheme}
        subThemes={subThemesByYearAsOptions}
        themeId={currentThemeField?.value}
        themeIndex={themeIndex}
      />
      {tagsByYearAsOptions && tagsByYearAsOptions.length > 0 && (
        <TagsSelector actionIndex={actionIndex} tags={tagsByYearAsOptions} themeIndex={themeIndex} />
      )}
    </ActionThemeWrapper>
  )
}

const ActionThemeWrapper = styled.div`
  flex: 1;
`
