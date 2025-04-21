import { useGetAdministrationsQuery } from '@api/administrationsAPI'
import { RTK_DEFAULT_QUERY_OPTIONS } from '@api/constants'
import { useGetControlUnitsQuery } from '@api/controlUnitsAPI'
import { RecentActivity } from '@features/RecentActivity/types'
import { useGetControlPlans } from '@hooks/useGetControlPlans'
import { getOptionsFromIdAndName, getOptionsFromLabelledEnum } from '@mtes-mct/monitor-ui'
import { isNotArchived } from '@utils/isNotArchived'
import { useMemo } from 'react'

export const useGetFiltersOptions = ({ filters }) => {
  const { data: administrations, isLoading: isLoadingAdministrations } = useGetAdministrationsQuery(
    undefined,
    RTK_DEFAULT_QUERY_OPTIONS
  )
  const { data: controlUnits, isLoading: isLoadingControlUnits } = useGetControlUnitsQuery(
    undefined,
    RTK_DEFAULT_QUERY_OPTIONS
  )
  const { isLoading: isLoadingThemes, themesAsOptions } = useGetControlPlans()

  const administrationsOptions = useMemo(
    () =>
      (administrations ?? []).filter(isNotArchived).map(admin => ({
        label: admin.name,
        value: admin.id
      })),
    [administrations]
  )

  const controlUnitsAsOptions = useMemo(() => {
    const activeControlUnits = (controlUnits ?? []).filter(isNotArchived)
    const selectableControlUnits = activeControlUnits?.filter(
      activeControlUnit =>
        filters.administrationIds?.length === 0 ||
        !filters.administrationIds ||
        filters.administrationIds?.includes(activeControlUnit.administrationId)
    )

    return getOptionsFromIdAndName(selectableControlUnits) ?? []
  }, [controlUnits, filters.administrationIds])

  const dateRangeOptions = getOptionsFromLabelledEnum(RecentActivity.RecentActivityDateRangeLabels)

  return {
    administrations,
    controlUnits,
    options: {
      administrationsOptions,
      controlUnitsAsOptions,
      dateRangeOptions,
      isLoading: isLoadingAdministrations || isLoadingControlUnits || isLoadingThemes,
      themesAsOptions
    }
  }
}
