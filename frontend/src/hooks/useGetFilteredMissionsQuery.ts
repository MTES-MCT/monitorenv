import { isMissionPartOfSelectedAdministrationNames } from '@features/Mission/useCases/filters/isMissionPartOfSelectedAdministrationNames'
import { isMissionPartOfSelectedCompletionStatus } from '@features/Mission/useCases/filters/isMissionPartOfSelectedCompletionStatus'
import { isMissionPartOfSelectedControlPlans } from '@features/Mission/useCases/filters/isMissionPartOfSelectedControlPlans'
import { isMissionPartOfSelectedControlUnitIds } from '@features/Mission/useCases/filters/isMissionPartOfSelectedControlUnitIds'
import { isMissionPartOfSelectedWithEnvActions } from '@features/Mission/useCases/filters/isMissionPartOfSelectedWithEnvActions'
import { useMemo } from 'react'

import { useAppSelector } from './useAppSelector'
import { useGetMissionsQuery } from '../api/missionsAPI'

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
