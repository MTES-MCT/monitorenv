import { useField } from 'formik'
import styled from 'styled-components'

import { TagsSelector } from './TagsSelector'
import { ThemeSelector } from './ThemeSelector'
import { SubThemesSelector } from './ThemeSelector/SubThemesSelector'
import { useGetControlPlansByYear } from '../../../../../hooks/useGetControlPlansByYear'

type ActionThemeProps = {
  actionIndex: number
  labelSubTheme: string
  labelTheme: string
  themeIndex: number
  themesYear: number
}
export function ActionTheme({ actionIndex, labelSubTheme, labelTheme, themeIndex, themesYear }: ActionThemeProps) {
  const [currentThemeField] = useField<number>(`envActions[${actionIndex}].controlPlans[${themeIndex}].themeId`)

  const { isError, isLoading, subThemesByYearAsOptions, tagsByYearAsOptions, themesByYearAsOptions } =
    useGetControlPlansByYear({
      selectedTheme: currentThemeField?.value,
      year: themesYear
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
