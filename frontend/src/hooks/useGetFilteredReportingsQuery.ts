import { filter } from 'lodash'
import { useMemo } from 'react'

import { useAppSelector } from './useAppSelector'
import { useGetReportingsQuery } from '../api/reportingsAPI'
import { themeFilterFunction } from '../domain/use_cases/reportings/filters/themeFilterFunction'
import { unitFilterFunction } from '../domain/use_cases/reportings/filters/unitFilterFunction'

const TWO_MINUTES = 2 * 60 * 1000

export const useGetFilteredReportingsQuery = () => {
  const { seaFrontFilter, sourceFilter, startedAfter, startedBefore, statusFilter, themeFilter, unitFilter } =
    useAppSelector(state => state.reportingFilters)
  const { data, isError, isFetching, isLoading } = useGetReportingsQuery(
    {
      reportingSource: sourceFilter,
      reportingStatus: statusFilter,
      seaFronts: seaFrontFilter,
      startedAfterDateTime: startedAfter || undefined,
      startedBeforeDateTime: startedBefore || undefined
    },
    { pollingInterval: TWO_MINUTES }
  )

  const reportings = useMemo(() => {
    if (!data?.entities) {
      return []
    }

    return filter(
      data.entities,
      reporting =>
        !!reporting && unitFilterFunction(reporting, unitFilter) && themeFilterFunction(reporting, themeFilter)
    )
  }, [data, themeFilter, unitFilter])

  return { isError, isFetching, isLoading, reportings }
}
