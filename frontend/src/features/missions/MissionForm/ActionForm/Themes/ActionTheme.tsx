import { customDayjs } from '@mtes-mct/monitor-ui'
import { useField, useFormikContext } from 'formik'
import styled from 'styled-components'

import { TagsSelector } from './TagsSelector'
import { ThemeSelector } from './ThemeSelector'
import { SubThemesSelector } from './ThemeSelector/SubThemesSelector'
import { useGetControlPlansByYear } from '../../../../../hooks/useGetControlPlansByYear'

import type { Mission } from '../../../../../domain/entities/missions'

type ActionThemeProps = {
  actionIndex: number
  labelSubTheme: string
  labelTheme: string
  themeIndex: number
}
export function ActionTheme({ actionIndex, labelSubTheme, labelTheme, themeIndex }: ActionThemeProps) {
  const { values } = useFormikContext<Mission>()
  const actionDate =
    values?.envActions[actionIndex]?.actionStartDateTimeUtc || values.startDateTimeUtc || new Date().toISOString()
  const year = customDayjs(actionDate).year()
  const [currentThemeField] = useField<number>(`envActions[${actionIndex}].controlPlans[${themeIndex}].themeId`)

  const { isError, isLoading, subThemesByYearAsOptions, tagsByYearAsOptions, themesByYearAsOptions } =
    useGetControlPlansByYear({
      selectedTheme: currentThemeField?.value,
      year
    })

  return (
    <ActionThemeWrapper data-cy="envaction-theme-element">
      <ThemeSelector
        actionIndex={actionIndex}
        isError={isError}
        isLoading={isLoading}
        label={labelTheme}
        themeIndex={themeIndex}
        themes={themesByYearAsOptions}
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
