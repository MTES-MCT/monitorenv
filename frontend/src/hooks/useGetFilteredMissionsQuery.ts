import { useMemo } from 'react'

import { useAppSelector } from './useAppSelector'
import { useGetMissionsQuery } from '../api/missionsAPI'
import { isMissionPartOfSelectedAdministrationNames } from '../domain/use_cases/missions/filters/isMissionPartOfSelectedAdministrationNames'
import { isMissionPartOfSelectedControlUnitIds } from '../domain/use_cases/missions/filters/isMissionPartOfSelectedControlUnitIds'
import { isMissionPartOfSelectedThemes } from '../domain/use_cases/missions/filters/isMissionPartOfSelectedThemes'

const TWO_MINUTES = 2 * 60 * 1000

export const useGetFilteredMissionsQuery = () => {
  const {
    selectedAdministrationNames = [],
    selectedControlUnitIds = [],
    selectedMissionSource,
    selectedMissionTypes,
    selectedSeaFronts,
    selectedStatuses,
    selectedThemes = [],
    startedAfter,
    startedBefore
  } = useAppSelector(state => state.missionFilters)
  const {
    data: missions,
    isError,
    isFetching,
    isLoading
  } = useGetMissionsQuery(
    {
      missionSource: selectedMissionSource,
      missionStatus: selectedStatuses,
      missionTypes: selectedMissionTypes,
      seaFronts: selectedSeaFronts,
      startedAfterDateTime: startedAfter || undefined,
      startedBeforeDateTime: startedBefore || undefined
    },
    { pollingInterval: TWO_MINUTES }
  )

  const filteredMissions = useMemo(() => {
    if (!missions) {
      return []
    }

    if (
      selectedAdministrationNames?.length === 0 &&
      selectedControlUnitIds?.length === 0 &&
      selectedThemes?.length === 0
    ) {
      return missions
    }

    return missions.filter(
      mission =>
        isMissionPartOfSelectedAdministrationNames(mission, selectedAdministrationNames) &&
        isMissionPartOfSelectedControlUnitIds(mission, selectedControlUnitIds) &&
        isMissionPartOfSelectedThemes(mission, selectedThemes)
    )
  }, [missions, selectedAdministrationNames, selectedControlUnitIds, selectedThemes])

  return { isError, isFetching, isLoading, missions: filteredMissions }
}
