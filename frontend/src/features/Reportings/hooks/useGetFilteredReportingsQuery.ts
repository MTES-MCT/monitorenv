import { useGetReportingsQuery } from '@api/reportingsAPI'
import { useAppSelector } from '@hooks/useAppSelector'
import { useGetCurrentUserAuthorizationQueryOverride } from '@hooks/useGetCurrentUserAuthorizationQueryOverride'
import { getDatesFromFilters } from '@utils/getDatesFromFilters'
import { DateRangeEnum } from 'domain/entities/dateRange'
import { StatusFilterEnum } from 'domain/entities/reporting'
import { filter } from 'lodash'
import { useMemo } from 'react'

import { TWO_MINUTES } from '../../../constants'
import { isReportingPartOfSource } from '../useCases/filters/isReportingPartOfSource'
import { isReportingPartOfTag } from '../useCases/filters/isReportingPartOfTag'
import { isReportingPartOfTheme } from '../useCases/filters/isReportingPartOfTheme'

export const useGetFilteredReportingsQuery = (skip = false) => {
  const result = useGetCurrentUserAuthorizationQueryOverride()
  const isSuperUser = result?.isSuperUser ?? true

  const {
    isAttachedToMissionFilter,
    isUnattachedToMissionFilter,
    periodFilter,
    seaFrontFilter,
    searchQueryFilter,
    sourceFilter,
    sourceTypeFilter,
    startedAfter,
    startedBefore,
    statusFilter,
    tagFilter,
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

  const datesForApi = useMemo(
    () => getDatesFromFilters({ periodFilter, startedAfter, startedBefore, withLast24Hours: true }),
    [startedAfter, startedBefore, periodFilter]
  )

  const hasCustomPeriodWithoutDates = periodFilter === DateRangeEnum.CUSTOM && (!startedAfter || !startedBefore)

  const { data, isError, isFetching, isLoading } = useGetReportingsQuery(
    // BACK filters
    {
      isAttachedToMission: isAttachedOrNotToMissionFilter,
      reportingType: typeFilter,
      seaFronts: seaFrontFilter,
      searchQuery: searchQueryFilter,
      sourcesType: sourceTypeFilter,
      startedAfterDateTime: datesForApi.startedAfterDate,
      startedBeforeDateTime: datesForApi.startedBeforeDate,
      status: isSuperUser ? statusFilter : [StatusFilterEnum.IN_PROGRESS],
      targetTypes: targetTypeFilter
    },
    { pollingInterval: TWO_MINUTES, skip: hasCustomPeriodWithoutDates || skip }
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
        isReportingPartOfTheme(reporting, themeFilter) &&
        isReportingPartOfTag(reporting, tagFilter) &&
        isReportingPartOfSource(reporting, sourceFilter)
    )
  }, [data, themeFilter, sourceFilter, tagFilter])

  return { isError, isFetching, isLoading, reportings }
}
