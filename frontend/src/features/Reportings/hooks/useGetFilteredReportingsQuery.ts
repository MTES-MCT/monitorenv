import { customDayjs } from '@mtes-mct/monitor-ui'
import { DateRangeEnum } from 'domain/entities/dateRange'
import { filter } from 'lodash'
import { useMemo } from 'react'

import { useGetReportingsQuery } from '../../../api/reportingsAPI'
import { TWO_MINUTES } from '../../../constants'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { sourceFilterFunction } from '../useCases/filters/sourceFilterFunction'
import { themeFilterFunction } from '../useCases/filters/themeFilterFunction'

export const useGetFilteredReportingsQuery = (skip = false) => {
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

  const datesForApi = useMemo(() => {
    let startedAfterDate = startedAfter ?? undefined
    const startedBeforeDate = startedBefore ?? undefined
    switch (periodFilter) {
      case DateRangeEnum.DAY:
        // to prevent refeteching every second we don't send seconds in query
        startedAfterDate = `${customDayjs().utc().subtract(24, 'hour').format('YYYY-MM-DDTHH:mm')}:00.000Z`

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
  }, [startedAfter, startedBefore, periodFilter])

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
      status: statusFilter,
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
        themeFilterFunction(reporting, themeFilter) &&
        sourceFilterFunction(reporting, sourceFilter)
    )
  }, [data, themeFilter, sourceFilter])

  return { isError, isFetching, isLoading, reportings }
}
