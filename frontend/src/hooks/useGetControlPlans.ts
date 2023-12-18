import { useMemo } from 'react'

import { useAppSelector } from './useAppSelector'
import { useGetControlPlansQuery } from '../api/controlPlans'

import type { Option } from '@mtes-mct/monitor-ui'

export function useGetControlPlans() {
  const themeFilter = useAppSelector(state => state.reportingFilters.themeFilter)
  const { data, isError, isLoading } = useGetControlPlansQuery()

  const themesAsOptions: Array<Option<number>> = useMemo(
    () =>
      Object.values(data?.themes || {}).map(({ id, theme }) => ({
        label: theme,
        value: id
      })) || [],
    [data?.themes]
  )

  const subThemesAsOptions: Array<Option<number>> = useMemo(
    () =>
      Object.values(data?.subThemes || {})
        .filter(subTheme => (themeFilter ? themeFilter.includes(subTheme.themeId) : true))
        .map(({ id, subTheme }) => ({ label: subTheme, value: id })) || [],
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
