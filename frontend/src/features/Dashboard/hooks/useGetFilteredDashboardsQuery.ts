import { useGetDashboardsQuery } from '@api/dashboardsAPI'
import { useGetRegulatoryLayersQuery } from '@api/regulatoryLayersAPI'
import { useAppSelector } from '@hooks/useAppSelector'
import { customDayjs, type DateAsStringRange } from '@mtes-mct/monitor-ui'
import { DateRangeEnum } from 'domain/entities/dateRange'
import { useMemo } from 'react'

import { TWO_MINUTES } from '../../../constants'

export const useGetFilteredDashboardsQuery = (skip = false) => {
  const { controlUnits, regulatoryThemes, seaFronts, specificPeriod, updatedAt } = useAppSelector(
    state => state.dashboardFilters.filters
  )
  const { data: regulatoryAreas } = useGetRegulatoryLayersQuery()

  const {
    data: dashboards,
    isError,
    isFetching,
    isLoading
  } = useGetDashboardsQuery(undefined, {
    pollingInterval: TWO_MINUTES,
    skip
  })

  const filteredDashboards = useMemo(
    () =>
      dashboards
        ?.filter(dashboard => seaFronts.length === 0 || (dashboard.seaFront && seaFronts.includes(dashboard.seaFront)))
        .filter(
          dashboard =>
            controlUnits.length === 0 || dashboard.controlUnitIds.some(control => controlUnits.includes(control))
        )
        .filter(dashboard => {
          if (regulatoryThemes.length === 0) {
            return true
          }

          const filteredRegulatoryAreas = Object.values(regulatoryAreas?.entities ?? []).filter(regulatoryArea =>
            dashboard.regulatoryAreaIds?.includes(regulatoryArea.id)
          )

          return filteredRegulatoryAreas.some(reg => regulatoryThemes.includes(reg.layer_name))
        })
        .filter(dashboard => isWithinPeriod(updatedAt, dashboard.updatedAt, specificPeriod)),
    [controlUnits, dashboards, regulatoryAreas?.entities, regulatoryThemes, seaFronts, updatedAt, specificPeriod]
  )

  return { dashboards: filteredDashboards, isError, isFetching, isLoading }
}

function isWithinPeriod(
  dateRange: DateRangeEnum | undefined,
  date: string | undefined,
  specificPeriod: DateAsStringRange | undefined
): boolean {
  if (!dateRange) {
    return true
  }
  const now = customDayjs().utc()
  const dateAsDayJs = customDayjs(date).utc()
  switch (dateRange) {
    case DateRangeEnum.DAY: {
      return dateAsDayJs.isBetween(now, now.startOf('day'))
    }
    case DateRangeEnum.WEEK: {
      return dateAsDayJs.isBetween(now, now.startOf('day').subtract(1, 'week'))
    }
    case DateRangeEnum.MONTH: {
      return dateAsDayJs.isBetween(now, now.startOf('day').subtract(1, 'month'))
    }
    case DateRangeEnum.YEAR: {
      return dateAsDayJs.isBetween(now, now.startOf('year'))
    }
    case DateRangeEnum.CUSTOM: {
      if (!specificPeriod) {
        return true
      }

      return dateAsDayJs.isBetween(
        customDayjs(specificPeriod[0]).utc().startOf('day'),
        customDayjs(specificPeriod[1]).utc().endOf('day')
      )
    }
    default:
      return true
  }
}
