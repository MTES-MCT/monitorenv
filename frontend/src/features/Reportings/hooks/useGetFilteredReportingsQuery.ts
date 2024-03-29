import { filter } from 'lodash'
import { useMemo } from 'react'

import { useGetReportingsQuery } from '../../../api/reportingsAPI'
import { sourceFilterFunction } from '../../../domain/use_cases/reporting/filters/sourceFilterFunction'
import { subThemesFilterFunction } from '../../../domain/use_cases/reporting/filters/subThemesFilterFunction'
import { themeFilterFunction } from '../../../domain/use_cases/reporting/filters/themeFilterFunction'
import { useAppSelector } from '../../../hooks/useAppSelector'

const TWO_MINUTES = 2 * 60 * 1000

export const useGetFilteredReportingsQuery = () => {
  const {
    isAttachedToMissionFilter,
    isUnattachedToMissionFilter,
    seaFrontFilter,
    searchQueryFilter,
    sourceFilter,
    sourceTypeFilter,
    startedAfter,
    startedBefore,
    statusFilter,
    subThemesFilter,
    targetTypeFilter,
    themeFilter,
    typeFilter
  } = useAppSelector(state => state.reportingFilters)

  const isAttachedOrNotToMissionFilter = useMemo(() => {
    if (isAttachedToMissionFilter && !isUnattachedToMissionFilter) {
      return Boolean(true)
    }

    if (!isAttachedToMissionFilter && isUnattachedToMissionFilter) {
      return Boolean(false)
    }

    return undefined
  }, [isAttachedToMissionFilter, isUnattachedToMissionFilter])

  // to search differents words the back needs "&" between words
  const formattedQuerySearch = useMemo(() => {
    if (searchQueryFilter) {
      return searchQueryFilter.trim().replace(' ', '&')
    }

    return undefined
  }, [searchQueryFilter])

  const { data, isError, isFetching, isLoading } = useGetReportingsQuery(
    // BACK filters
    {
      isAttachedToMission: isAttachedOrNotToMissionFilter,
      reportingType: typeFilter,
      seaFronts: seaFrontFilter,
      searchQuery: formattedQuerySearch,
      sourcesType: sourceTypeFilter,
      startedAfterDateTime: startedAfter ?? undefined,
      startedBeforeDateTime: startedBefore ?? undefined,
      status: statusFilter,
      targetTypes: targetTypeFilter
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
