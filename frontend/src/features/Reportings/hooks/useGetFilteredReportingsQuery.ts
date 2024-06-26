import { customDayjs } from '@mtes-mct/monitor-ui'
import { ReportingDateRangeEnum } from 'domain/entities/dateRange'
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
    periodFilter,
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

  const datesForApi = useMemo(() => {
    let startedAfterDate = startedAfter ?? undefined
    const startedBeforeDate = startedBefore ?? undefined
    switch (periodFilter) {
      case ReportingDateRangeEnum.DAY:
        // to prevent refeteching every second we don't send seconds in query
        startedAfterDate = `${customDayjs().utc().subtract(24, 'hour').format('YYYY-MM-DDTHH:mm')}:00.000Z`

        break

      case ReportingDateRangeEnum.WEEK:
        startedAfterDate = customDayjs().utc().startOf('day').utc().subtract(7, 'day').toISOString()

        break

      case ReportingDateRangeEnum.MONTH:
        startedAfterDate = customDayjs().utc().startOf('day').utc().subtract(30, 'day').toISOString()

        break
      case ReportingDateRangeEnum.YEAR:
        startedAfterDate = customDayjs().utc().startOf('year').toISOString()

        break

      case ReportingDateRangeEnum.CUSTOM:
      default:
        break
    }

    return { startedAfterDate, startedBeforeDate }
  }, [startedAfter, startedBefore, periodFilter])

  const { data, isError, isFetching, isLoading } = useGetReportingsQuery(
    // BACK filters
    {
      isAttachedToMission: isAttachedOrNotToMissionFilter,
      reportingType: typeFilter,
      seaFronts: seaFrontFilter,
      searchQuery: formattedQuerySearch,
      sourcesType: sourceTypeFilter,
      startedAfterDateTime: datesForApi.startedAfterDate,
      startedBeforeDateTime: datesForApi.startedBeforeDate,
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
