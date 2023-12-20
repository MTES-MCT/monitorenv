import { sortBy } from 'lodash/fp'
import { useMemo } from 'react'

import { useGetControlPlansByYearQuery } from '../api/controlPlans'

import type { Option } from '@mtes-mct/monitor-ui'

const sortFunction = (a: Option<number>, b: Option<number>) => {
  if (a.label.includes('Autre')) {
    return 1
  }
  if (b.label.includes('Autre')) {
    return -1
  }

  if (a?.label < b?.label) {
    return -1
  }
  if (a?.label > b?.label) {
    return 1
  }

  return 0
}

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
      Object.values(data?.themes || {})
        .map(({ id, theme }) => ({
          label: theme,
          value: id
        }))
        .sort(sortFunction) || [],
    [data?.themes]
  )

  const subThemesByYearAsOptions: Array<Option<number>> = useMemo(
    () =>
      Object.values(data?.subThemes || {})
        ?.filter(({ themeId }) => themeId === selectedTheme)
        .map(({ id, subTheme }) => ({ label: subTheme, value: id }))
        .sort(sortFunction) || [],
    [data?.subThemes, selectedTheme]
  )

  const tagsByYearAsOptions: Array<Option<number>> = useMemo(
    () =>
      sortBy(
        'label',
        Object.values(data?.tags || {})
          ?.filter(({ themeId }) => themeId === selectedTheme)
          .map(({ id, tag }) => ({ label: tag, value: id }))
      ) || [],
    [data?.tags, selectedTheme]
  )

  const themesByYear = useMemo(() => data?.themes || {}, [data?.themes])

  return {
    isError,
    isLoading,
    subThemesByYearAsOptions,
    tagsByYearAsOptions,
    themesByYear,
    themesByYearAsOptions
  }
}
