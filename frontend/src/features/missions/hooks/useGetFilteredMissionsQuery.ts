import { useGetMissionsQuery } from '@api/missionsAPI'
import { useAppSelector } from '@hooks/useAppSelector'
import { customDayjs } from '@mtes-mct/monitor-ui'
import { DateRangeEnum } from 'domain/entities/dateRange'
import { isMissionPartOfSelectedAdministrationNames } from 'domain/use_cases/missions/filters/isMissionPartOfSelectedAdministrationNames'
import { isMissionPartOfSelectedCompletionStatus } from 'domain/use_cases/missions/filters/isMissionPartOfSelectedCompletionStatus'
import { isMissionPartOfSelectedControlPlans } from 'domain/use_cases/missions/filters/isMissionPartOfSelectedControlPlans'
import { isMissionPartOfSelectedControlUnitIds } from 'domain/use_cases/missions/filters/isMissionPartOfSelectedControlUnitIds'
import { isMissionPartOfSelectedWithEnvActions } from 'domain/use_cases/missions/filters/isMissionPartOfSelectedWithEnvActions'
import { useMemo } from 'react'

import { TWO_MINUTES } from '../../../constants'

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
    selectedThemes,
    selectedWithEnvActions,
    startedAfter,
    startedBefore
  } = useAppSelector(state => state.missionFilters)

  const datesForApi = useMemo(() => {
    let startedAfterDate = startedAfter ?? undefined
    const startedBeforeDate = startedBefore ?? undefined

    switch (selectedPeriod) {
      case DateRangeEnum.DAY:
        startedAfterDate = customDayjs().utc().startOf('day').toISOString()

        break

      case DateRangeEnum.WEEK:
        startedAfterDate = customDayjs().utc().startOf('day').utc().subtract(7, 'day').toISOString()

        break

      case DateRangeEnum.MONTH:
        startedAfterDate = customDayjs().utc().startOf('day').utc().subtract(30, 'day').toISOString()

        break
      case DateRangeEnum.YEAR:
        startedAfterDate = customDayjs().utc().startOf('year').toISOString()

        break

      case DateRangeEnum.CUSTOM:
      default:
        break
    }

    return { startedAfterDate, startedBeforeDate }
  }, [startedAfter, startedBefore, selectedPeriod])

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
