import { useGetControlPlansQuery } from '../api/controlPlans'

import type { Option } from '@mtes-mct/monitor-ui'

export function useGetControlPlans() {
  const { data, isError, isLoading } = useGetControlPlansQuery()

  const themesAsOptions: Array<Option<number>> =
    Object.values(data?.themes || {}).map(({ id, theme }) => ({
      label: theme,
      value: id
    })) || []

  const subThemesAsOptions: Array<Option<number>> =
    Object.values(data?.subThemes || {}).map(({ id, subTheme }) => ({ label: subTheme, value: id })) || []

  return {
    isError,
    isLoading,
    subThemes: data?.subThemes || {},
    subThemesAsOptions,
    themes: data?.themes || {},
    themesAsOptions
  }
}
