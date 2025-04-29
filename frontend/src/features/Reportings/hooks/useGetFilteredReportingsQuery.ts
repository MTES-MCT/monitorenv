import { customDayjs } from '@mtes-mct/monitor-ui'
import { DateRangeEnum } from 'domain/entities/dateRange'
import { filter } from 'lodash'
import { useMemo } from 'react'

import { useGetReportingsQuery } from '../../../api/reportingsAPI'
import { TWO_MINUTES } from '../../../constants'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { isReportingPartOfSource } from '../useCases/filters/isReportingPartOfSource'
import { isReportingPartOfTag } from '../useCases/filters/isReportingPartOfTag'
import { isReportingPartOfTheme } from '../useCases/filters/isReportingPartOfTheme'

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
        isReportingPartOfTheme(reporting, themeFilter) &&
        isReportingPartOfTag(reporting, tagFilter) &&
        isReportingPartOfSource(reporting, sourceFilter)
    )
  }, [data, themeFilter, sourceFilter, tagFilter])

  return { isError, isFetching, isLoading, reportings }
}
