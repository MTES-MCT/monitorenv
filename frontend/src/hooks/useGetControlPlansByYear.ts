import { sortBy } from 'lodash/fp'
import { useMemo } from 'react'

import { useGetControlPlansByYearQuery } from '../api/controlPlans'
import { sortControlPlans } from '../utils/sortControlPlans'

import type { Option } from '@mtes-mct/monitor-ui'

export function useGetControlPlansByYear({
  selectedTheme = undefined,
  year
}: {
  selectedTheme?: number | undefined
  year: number
}) {
  const { data, isError, isLoading } = useGetControlPlansByYearQuery(year)

  const themesByYearAsOptions: Array<Option<number>> = useMemo(
    () =>
      Object.values(data?.themes ?? {})
        .map(({ id, theme }) => ({
          label: theme,
          value: id
        }))
        .sort(sortControlPlans) || [],
    [data?.themes]
  )

  const subThemesByYearAsOptions: Array<Option<number>> = useMemo(
    () =>
      Object.values(data?.subThemes ?? {})
        ?.filter(({ themeId }) => (selectedTheme ? themeId === selectedTheme : true))
        .map(({ id, subTheme }) => ({ label: subTheme, value: id }))
        .sort(sortControlPlans) || [],
    [data?.subThemes, selectedTheme]
  )

  const tagsByYearAsOptions: Array<Option<number>> = useMemo(
    () =>
      sortBy(
        'label',
        Object.values(data?.tags ?? {})
          ?.filter(({ themeId }) => themeId === selectedTheme)
          .map(({ id, tag }) => ({ label: tag, value: id }))
      ) || [],
    [data?.tags, selectedTheme]
  )

  const themesByYear = useMemo(() => data?.themes ?? {}, [data?.themes])

  const subThemesByYear = useMemo(() => data?.subThemes ?? {}, [data?.subThemes])

  return {
    isError,
    isLoading,
    subThemesByYear,
    subThemesByYearAsOptions,
    tagsByYearAsOptions,
    themesByYear,
    themesByYearAsOptions
  }
}
