import { useGetMissionsQuery } from '@api/missionsAPI'
import { isMissionPartOfSelectedAdministrationNames } from '@features/Mission/useCases/filters/isMissionPartOfSelectedAdministrationNames'
import { isMissionPartOfSelectedCompletionStatus } from '@features/Mission/useCases/filters/isMissionPartOfSelectedCompletionStatus'
import { isMissionPartOfSelectedControlUnitIds } from '@features/Mission/useCases/filters/isMissionPartOfSelectedControlUnitIds'
import { isMissionPartOfSelectedThemes } from '@features/Mission/useCases/filters/isMissionPartOfSelectedTheme'
import { isMissionPartOfSelectedWithEnvActions } from '@features/Mission/useCases/filters/isMissionPartOfSelectedWithEnvActions'
import { useAppSelector } from '@hooks/useAppSelector'
import { getDatesFromFilters } from '@utils/getDatesFromFilters'
import { DateRangeEnum } from 'domain/entities/dateRange'
import { useMemo } from 'react'

import { TWO_MINUTES } from '../../../constants'
import { isMissionPartOfSelectedTags } from '../useCases/filters/isMissionPartOfSelectedTags'

export const useGetFilteredMissionsQuery = () => {
  const {
    searchQuery,
    selectedAdministrationNames,
    selectedCompletionStatus,
    selectedControlUnitIds,
    selectedMissionTypes,
    selectedPeriod,
    selectedSeaFronts,
    selectedStatuses,
    selectedTags,
    selectedThemes,
    selectedWithEnvActions,
    startedAfter,
    startedBefore
  } = useAppSelector(state => state.missionFilters)

  const datesForApi = useMemo(
    () => getDatesFromFilters(startedAfter, startedBefore, selectedPeriod),
    [startedAfter, startedBefore, selectedPeriod]
  )

  const hasCustomPeriodWithoutDates = selectedPeriod === DateRangeEnum.CUSTOM && (!startedAfter || !startedBefore)

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
      searchQuery,
      startedAfterDateTime: datesForApi.startedAfterDate,
      startedBeforeDateTime: datesForApi.startedBeforeDate,
      withEnvActions: selectedWithEnvActions
    },
    { pollingInterval: TWO_MINUTES, skip: hasCustomPeriodWithoutDates }
  )

  const filteredMissions = useMemo(() => {
    if (!missions) {
      return []
    }

    if (
      selectedAdministrationNames?.length === 0 &&
      selectedControlUnitIds?.length === 0 &&
      selectedThemes?.length === 0 &&
      selectedTags?.length === 0
    ) {
      return missions
    }

    return missions.filter(
      mission =>
        isMissionPartOfSelectedAdministrationNames(mission, selectedAdministrationNames) &&
        isMissionPartOfSelectedControlUnitIds(mission, selectedControlUnitIds) &&
        isMissionPartOfSelectedThemes(mission, selectedThemes) &&
        isMissionPartOfSelectedTags(mission, selectedTags) &&
        isMissionPartOfSelectedCompletionStatus(mission, selectedCompletionStatus) &&
        isMissionPartOfSelectedWithEnvActions(mission, selectedWithEnvActions)
    )
  }, [
    missions,
    selectedAdministrationNames,
    selectedControlUnitIds,
    selectedThemes,
    selectedTags,
    selectedCompletionStatus,
    selectedWithEnvActions
  ])

  return { isError, isFetching, isLoading, missions: filteredMissions }
}
