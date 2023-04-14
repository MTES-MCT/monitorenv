import { useMemo } from 'react'

import { useGetMissionsQuery } from '../api/missionsAPI'
import { useAppSelector } from './useAppSelector'

const TWO_MINUTES = 2 * 60 * 1000

export const useGetFilteredMissionsQuery = () => {
  const { administrationFilter, sourceFilter, startedAfter, startedBefore, statusFilter, typeFilter, unitFilter } =
    useAppSelector(state => state.missionFilters)
  const { data, isError, isLoading } = useGetMissionsQuery(
    {
      missionSource: sourceFilter,
      missionStatus: statusFilter,
      missionTypes: typeFilter,
      startedAfterDateTime: startedAfter || undefined,
      startedBeforeDateTime: startedBefore || undefined
    },
    { pollingInterval: TWO_MINUTES }
  )

  const missions = useMemo(() => {
    if (!data) {
      return []
    }

    if (administrationFilter.length === 0 && unitFilter.length === 0) {
      return data
    }

    if (unitFilter.length > 0) {
      return data.filter(
        mission =>
          !!mission.controlUnits.find(controlUnit => {
            if (unitFilter.find(unit => unit === controlUnit.name)) {
              return controlUnit
            }

            return undefined
          })
      )
    }

    return data.filter(mission =>
      mission.controlUnits.find(controlUnit => {
        if (administrationFilter.find(adminFilter => adminFilter === controlUnit.administration)) {
          return controlUnit
        }

        return undefined
      })
    )
  }, [data, administrationFilter, unitFilter])

  return { isError, isLoading, missions }
}
