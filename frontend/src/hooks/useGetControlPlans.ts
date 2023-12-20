import { useMemo } from 'react'

import { useAppSelector } from './useAppSelector'
import { useGetControlPlansQuery } from '../api/controlPlans'

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

export function useGetControlPlans() {
  const themeFilter = useAppSelector(state => state.reportingFilters.themeFilter)
  const { data, isError, isLoading } = useGetControlPlansQuery()

  const themesAsOptions: Array<Option<number>> = useMemo(
    () =>
      Object.values(data?.themes || {})
        .map(({ id, theme }) => ({
          label: theme,
          value: id
        }))
        .sort(sortFunction) || [],
    [data?.themes]
  )

  const subThemesAsOptions: Array<Option<number>> = useMemo(
    () =>
      Object.values(data?.subThemes || {})
        .filter(subTheme => (themeFilter ? themeFilter.includes(subTheme.themeId) : true))
        .map(({ id, subTheme }) => ({ label: subTheme, value: id }))
        .sort(sortFunction) || [],
    [data?.subThemes, themeFilter]
  )

  const themes = useMemo(() => data?.themes || {}, [data?.themes])
  const subThemes = useMemo(() => data?.subThemes || {}, [data?.subThemes])

  return {
    isError,
    isLoading,
    subThemes,
    subThemesAsOptions,
    themes,
    themesAsOptions
  }
}
