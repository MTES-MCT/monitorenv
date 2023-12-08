import { customDayjs } from '@mtes-mct/monitor-ui'
import { useField } from 'formik'
import styled from 'styled-components'

import { TagsSelector } from './TagsSelector'
import { ThemeSelector } from './ThemeSelector'
import { SubThemesSelector } from './ThemeSelector/SubThemesSelector'
import { useGetPlanThemesAndSubThemesAsOptions } from '../../../../../hooks/useGetPlanThemesAndSubThemesAsOptions'

type ActionThemeProps = {
  actionDate: string
  actionIndex: number
  labelSubTheme: string
  labelTheme: string
  themeIndex: number
}
export function ActionTheme({ actionDate, actionIndex, labelSubTheme, labelTheme, themeIndex }: ActionThemeProps) {
  const year = customDayjs(actionDate).year()
  const [currentThemeField] = useField<number>(`envActions[${actionIndex}].controlPlans[${themeIndex}].themeId`)

  const { isError, isLoading, subThemesAsOptions, tagsAsOptions, themesAsOptions } =
    useGetPlanThemesAndSubThemesAsOptions({
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
        themes={themesAsOptions}
      />
      <SubThemesSelector
        actionIndex={actionIndex}
        isError={isError}
        isLoading={isLoading}
        label={labelSubTheme}
        subThemes={subThemesAsOptions}
        themeId={currentThemeField?.value}
        themeIndex={themeIndex}
      />
      {tagsAsOptions && tagsAsOptions.length > 0 && (
        <TagsSelector actionIndex={actionIndex} tags={tagsAsOptions} themeIndex={themeIndex} />
      )}
    </ActionThemeWrapper>
  )
}

const ActionThemeWrapper = styled.div`
  flex: 1;
`
