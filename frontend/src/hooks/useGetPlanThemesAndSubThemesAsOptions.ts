import { useGetControlPlansQuery } from '../api/controlPlans'

import type { Option } from '@mtes-mct/monitor-ui'

export function useGetPlanThemesAndSubThemesAsOptions({
  selectedTheme = undefined,
  year
}: {
  selectedTheme?: number | undefined
  year: number
}) {
  const { data, isError, isLoading } = useGetControlPlansQuery(year)

  const themesAsOptions: Array<Option<number>> =
    Object.values(data?.themes || {}).map(({ id, theme }) => ({
      label: theme,
      value: id
    })) || []

  const subThemesAsOptions: Array<Option<number>> =
    Object.values(data?.subThemes || {})
      ?.filter(({ themeId }) => themeId === selectedTheme)
      .map(({ id, subTheme }) => ({ label: subTheme, value: id })) || []

  const tagsAsOptions: Array<Option<number>> =
    Object.values(data?.tags || {})
      ?.filter(({ themeId }) => themeId === selectedTheme)
      .map(({ id, tag }) => ({ label: tag, value: id })) || []

  return {
    isError,
    isLoading,
    subThemesAsOptions,
    tagsAsOptions,
    themesAsOptions
  }
}
