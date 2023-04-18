import _ from 'lodash'
import { useMemo } from 'react'

import { useGetMissionsQuery } from '../api/missionsAPI'
import { useAppSelector } from './useAppSelector'

const TWO_MINUTES = 2 * 60 * 1000

export const useGetFilteredMissionsQuery = () => {
  const {
    administrationFilter,
    seaFrontFilter,
    sourceFilter,
    startedAfter,
    startedBefore,
    statusFilter,
    themeFilter,
    typeFilter,
    unitFilter
  } = useAppSelector(state => state.missionFilters)
  const { data, isError, isLoading } = useGetMissionsQuery(
    {
      missionSource: sourceFilter,
      missionStatus: statusFilter,
      missionTypes: typeFilter,
      seaFronts: seaFrontFilter,
      startedAfterDateTime: startedAfter || undefined,
      startedBeforeDateTime: startedBefore || undefined
    },
    { pollingInterval: TWO_MINUTES }
  )

  const missions = useMemo(() => {
    if (!data) {
      return []
    }

    if (administrationFilter.length === 0 && unitFilter.length === 0 && themeFilter.length === 0) {
      return data
    }
    let tempData = data
    if (themeFilter.length > 0) {
      const missionWithActions = data.filter(mission => mission.envActions.length > 0)

      const missionsWithThemes = missionWithActions.reduce((acc, curr) => {
        const actions = _.flatten(curr.envActions)

        const themes = _.flatten(actions.map(action => action?.themes))
        const themesFormatted = themes?.map(theme => theme?.theme)

        return {
          ...acc,
          [curr.id]: themesFormatted
        }
      }, {})

      const filteredMissions = Object.entries<any>(missionsWithThemes).map(([key, value]) => {
        if (value.find(theme => themeFilter.includes(theme))) {
          return key
        }

        return null
      })

      tempData = data.filter(mission => filteredMissions.includes(String(mission.id)))
    }

    if (unitFilter.length > 0) {
      return tempData.filter(
        mission =>
          !!mission.controlUnits.find(controlUnit => {
            if (unitFilter.find(unit => unit === controlUnit.name)) {
              return controlUnit
            }

            return undefined
          })
      )
    }

    if (administrationFilter.length > 0) {
      return tempData.filter(mission =>
        mission.controlUnits.find(controlUnit => {
          if (administrationFilter.find(adminFilter => adminFilter === controlUnit.administration)) {
            return controlUnit
          }

          return undefined
        })
      )
    }

    return tempData
  }, [data, administrationFilter, themeFilter, unitFilter])

  return { isError, isLoading, missions }
}
