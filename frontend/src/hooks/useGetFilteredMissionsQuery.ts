import { isMissionPartOfSelectedCompletionStatus } from 'domain/use_cases/missions/filters/isMissionPartOfSelectedCompletionStatus'
import { isMissionPartOfSelectedWithEnvActions } from 'domain/use_cases/missions/filters/isMissionPartOfSelectedWithEnvActions'
import { useMemo } from 'react'

import { useAppSelector } from './useAppSelector'
import { useGetMissionsQuery } from '../api/missionsAPI'
import { isMissionPartOfSelectedAdministrationNames } from '../domain/use_cases/missions/filters/isMissionPartOfSelectedAdministrationNames'
import { isMissionPartOfSelectedControlPlans } from '../domain/use_cases/missions/filters/isMissionPartOfSelectedControlPlans'
import { isMissionPartOfSelectedControlUnitIds } from '../domain/use_cases/missions/filters/isMissionPartOfSelectedControlUnitIds'

const TWO_MINUTES = 2 * 60 * 1000

export const useGetFilteredMissionsQuery = () => {
  const {
    selectedAdministrationNames,
    selectedCompletionStatus,
    selectedControlUnitIds,
    selectedMissionTypes,
    selectedSeaFronts,
    selectedStatuses,
    selectedThemes,
    selectedWithEnvActions,
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
      missionStatus: selectedStatuses,
      missionTypes: selectedMissionTypes,
      seaFronts: selectedSeaFronts,
      startedAfterDateTime: startedAfter ?? undefined,
      startedBeforeDateTime: startedBefore ?? undefined,
      withEnvActions: selectedWithEnvActions
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
        isMissionPartOfSelectedControlPlans(mission, selectedThemes) &&
        isMissionPartOfSelectedCompletionStatus(mission, selectedCompletionStatus) &&
        isMissionPartOfSelectedWithEnvActions(mission, selectedWithEnvActions)
    )
  }, [
    missions,
    selectedAdministrationNames,
    selectedControlUnitIds,
    selectedThemes,
    selectedCompletionStatus,
    selectedWithEnvActions
  ])

  return { isError, isFetching, isLoading, missions: filteredMissions }
}
