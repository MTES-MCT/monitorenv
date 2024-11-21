import { VigilanceArea } from '@features/VigilanceArea/types'
import { customDayjs } from '@mtes-mct/monitor-ui'
import isBetween from 'dayjs/plugin/isBetween'

import type { Dayjs } from 'dayjs'

customDayjs.extend(isBetween)

function isWithinPeriod(date: Dayjs, startDate: Dayjs, endDate: Dayjs) {
  return (date.isAfter(startDate) && date.isBefore(endDate)) || date.isSame(startDate) || date.isSame(endDate)
}

export const getFilterVigilanceAreasPerPeriod = (
  vigilanceAreas: (VigilanceArea.VigilanceAreaLayer | VigilanceArea.VigilanceAreaFromApi)[],
  periodFilter: VigilanceArea.VigilanceAreaFilterPeriod | undefined,
  vigilanceAreaSpecificPeriodFilter?: string[]
): Array<VigilanceArea.VigilanceAreaFromApi> => {
  const now = customDayjs()

  let startDateFilter: Dayjs
  let endDateFilter: Dayjs

  if (vigilanceAreaSpecificPeriodFilter) {
    startDateFilter = customDayjs(vigilanceAreaSpecificPeriodFilter[0]).utc()
    endDateFilter = customDayjs(vigilanceAreaSpecificPeriodFilter[1]).utc()
  } else {
    switch (periodFilter) {
      case VigilanceArea.VigilanceAreaFilterPeriod.AT_THE_MOMENT:
        startDateFilter = now.utc().startOf('day')
        endDateFilter = now.utc().endOf('day')
        break
      case VigilanceArea.VigilanceAreaFilterPeriod.CURRENT_QUARTER:
        startDateFilter = now.utc().startOf('quarter')
        endDateFilter = now.utc().endOf('quarter')
        break
      case VigilanceArea.VigilanceAreaFilterPeriod.CURRENT_YEAR:
        startDateFilter = now.utc().startOf('year')
        endDateFilter = now.utc().endOf('year')
        break
      case VigilanceArea.VigilanceAreaFilterPeriod.NEXT_THREE_MONTHS:
        startDateFilter = now.utc().startOf('day')
        endDateFilter = now.utc().add(3, 'months').endOf('day')
        break
      case VigilanceArea.VigilanceAreaFilterPeriod.SPECIFIC_PERIOD:
        break
      default:
        throw new Error('Invalid period')
    }
  }

  return Object.values((vigilanceAreas as Array<VigilanceArea.VigilanceAreaFromApi>) ?? []).filter(vigilanceArea => {
    if (!vigilanceArea || !vigilanceArea.startDatePeriod || !vigilanceArea.endDatePeriod) {
      return false
    }

    const startDate = customDayjs(vigilanceArea.startDatePeriod).utc()
    const endDate = customDayjs(vigilanceArea.endDatePeriod).utc()

    // in case there is no end of recurrence (because endingCondition is NEVER) we set a default end date to the end of the period filter
    const computedEndDate = vigilanceArea.computedEndDate ? customDayjs(vigilanceArea.computedEndDate) : endDateFilter

    if (vigilanceArea.frequency === VigilanceArea.Frequency.NONE) {
      return (
        isWithinPeriod(startDate, startDateFilter, endDateFilter) ||
        isWithinPeriod(endDate, startDateFilter, endDateFilter) ||
        startDateFilter?.isBetween(startDate, endDate) ||
        endDateFilter?.isBetween(startDate, endDate)
      )
    }

    if (
      !!startDateFilter &&
      !!endDateFilter &&
      (startDateFilter?.isBetween(startDate, endDate) || endDateFilter.isBetween(startDate, endDate))
    ) {
      return true
    }

    if (vigilanceArea.frequency) {
      let occurrenceDate = startDate

      while (occurrenceDate.isBefore(computedEndDate, 'day') || occurrenceDate.isSame(computedEndDate, 'day')) {
        if (isWithinPeriod(occurrenceDate, startDateFilter, endDateFilter)) {
          return true
        }
        switch (vigilanceArea.frequency) {
          case VigilanceArea.Frequency.ALL_WEEKS:
            occurrenceDate = occurrenceDate.add(7, 'day')
            break
          case VigilanceArea.Frequency.ALL_MONTHS:
            occurrenceDate = occurrenceDate.add(1, 'month')
            break
          case VigilanceArea.Frequency.ALL_YEARS:
            occurrenceDate = occurrenceDate.add(1, 'year')
            break
          default: // No recurrence
            break
        }
      }
    }

    return false
  })
}
