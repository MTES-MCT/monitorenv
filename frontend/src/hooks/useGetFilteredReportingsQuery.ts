import { filter } from 'lodash'
import { useMemo } from 'react'

import { useAppSelector } from './useAppSelector'
import { useGetReportingsQuery } from '../api/reportingsAPI'
import { sourceFilterFunction } from '../domain/use_cases/reportings/filters/sourceFilterFunction'
import { subThemesFilterFunction } from '../domain/use_cases/reportings/filters/subThemesFilterFunction'
import { themeFilterFunction } from '../domain/use_cases/reportings/filters/themeFilterFunction'

const TWO_MINUTES = 2 * 60 * 1000

export const useGetFilteredReportingsQuery = () => {
  const {
    provenFilter,
    seaFrontFilter,
    sourceFilter,
    sourceTypeFilter,
    startedAfter,
    startedBefore,
    statusFilter,
    subThemesFilter,
    themeFilter,
    typeFilter
  } = useAppSelector(state => state.reportingFilters)
  const { data, isError, isFetching, isLoading } = useGetReportingsQuery(
    // BACK filters
    {
      provenStatus: provenFilter,
      reportingType: typeFilter,
      seaFronts: seaFrontFilter,
      sourcesType: sourceTypeFilter,
      startedAfterDateTime: startedAfter || undefined,
      startedBeforeDateTime: startedBefore || undefined,
      status: statusFilter
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
        !!reporting &&
        // FRONT filters
        themeFilterFunction(reporting, themeFilter) &&
        subThemesFilterFunction(reporting, subThemesFilter) &&
        sourceFilterFunction(reporting, sourceFilter)
    )
  }, [data, themeFilter, subThemesFilter, sourceFilter])

  return { isError, isFetching, isLoading, reportings }
}
