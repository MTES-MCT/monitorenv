import { useGetMissionsQuery } from '../api/missionsAPI'
import { useAppSelector } from './useAppSelector'

const TWO_MINUTES = 2 * 60 * 1000

export const useGetFilteredMissionsQuery = () => {
  const { missionNatureFilter, missionStartedAfter, missionStartedBefore, missionStatusFilter, missionTypeFilter } =
    useAppSelector(state => state.missionFilters)

  const { data, isError, isLoading } = useGetMissionsQuery(
    {
      missionNature: missionNatureFilter,
      missionStatus: missionStatusFilter,
      missionTypes: missionTypeFilter,
      startedAfterDateTime: missionStartedAfter || undefined,
      startedBeforeDateTime: missionStartedBefore || undefined
    },
    { pollingInterval: TWO_MINUTES }
  )

  return { data, isError, isLoading }
}
