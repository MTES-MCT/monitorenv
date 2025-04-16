import { useMemo } from 'react'

import { useGetControlPlansQuery } from '../api/controlPlans'
import { sortControlPlans } from '../utils/sortControlPlans'

import type { Option } from '@mtes-mct/monitor-ui'

export function useGetControlPlans() {
  const { data, isError, isLoading } = useGetControlPlansQuery()

  const themesAsOptions: Array<Option<number>> = useMemo(
    () =>
      Object.values(data?.themes ?? {})
        .map(({ id, theme }) => ({
          label: theme,
          value: id
        }))
        .sort(sortControlPlans) ?? [],
    [data?.themes]
  )

  const themes = useMemo(() => data?.themes ?? {}, [data?.themes])
  const subThemes = useMemo(() => data?.subThemes ?? {}, [data?.subThemes])

  return {
    isError,
    isLoading,
    subThemes,
    themes,
    themesAsOptions
  }
}
