import { filter } from 'lodash'
import { useMemo } from 'react'

import { useAppSelector } from './useAppSelector'
import { useGetReportingsQuery } from '../api/reportingsAPI'
import { themeFilterFunction } from '../domain/use_cases/reportings/filters/themeFilterFunction'

const TWO_MINUTES = 2 * 60 * 1000

export const useGetFilteredReportingsQuery = () => {
  const { seaFrontFilter, sourceTypeFilter, startedAfter, startedBefore, themeFilter, typeFilter } = useAppSelector(
    state => state.reportingFilters
  )
  const { data, isError, isFetching, isLoading } = useGetReportingsQuery(
    {
      reportingSourceType: sourceTypeFilter,
      reportingType: typeFilter,
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

    return filter(data.entities, reporting => !!reporting && themeFilterFunction(reporting, themeFilter))
  }, [data, themeFilter])

  return { isError, isFetching, isLoading, reportings }
}
