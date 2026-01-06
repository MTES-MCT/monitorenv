import { VigilanceArea } from '@features/VigilanceArea/types'
import { getFilterInformativeVigilanceArea } from '@features/VigilanceArea/useCases/filters/isVigilanceAreaPartOfType'
import { customDayjs } from '@mtes-mct/monitor-ui'

import type { Dayjs } from 'dayjs'

function isWithinPeriod(endDate: Dayjs, startDate: Dayjs, startDateFilter: Dayjs, endDateFilter: Dayjs) {
  return (
    endDate.isBetween(startDateFilter, endDateFilter) ||
    startDate.isBetween(startDateFilter, endDateFilter) ||
    startDateFilter.isBetween(startDate, endDate) ||
    endDateFilter.isBetween(startDate, endDate) ||
    endDate.isSame(startDateFilter) ||
    endDate.isSame(endDateFilter) ||
    startDate.isSame(startDateFilter) ||
    startDate.isSame(endDateFilter)
  )
}

function calculatePeriodBounds(
  periodFilter: VigilanceArea.VigilanceAreaFilterPeriod | undefined,
  specificPeriodFilter?: string[]
): { endDate: Dayjs | undefined; startDate: Dayjs | undefined } {
  const now = customDayjs()

  if (specificPeriodFilter) {
    return {
      endDate: customDayjs(specificPeriodFilter[1]).utc(),
      startDate: customDayjs(specificPeriodFilter[0]).utc()
    }
  }

  switch (periodFilter) {
    case VigilanceArea.VigilanceAreaFilterPeriod.AT_THE_MOMENT:
      return { endDate: now.utc().endOf('day'), startDate: now.utc().startOf('day') }
    case VigilanceArea.VigilanceAreaFilterPeriod.CURRENT_QUARTER:
      return { endDate: now.utc().endOf('quarter'), startDate: now.utc().startOf('quarter') }
    case VigilanceArea.VigilanceAreaFilterPeriod.CURRENT_YEAR:
      return { endDate: now.utc().endOf('year'), startDate: now.utc().startOf('year') }
    case VigilanceArea.VigilanceAreaFilterPeriod.NEXT_THREE_MONTHS:
      return { endDate: now.utc().add(3, 'months').endOf('day'), startDate: now.utc().startOf('day') }
    case VigilanceArea.VigilanceAreaFilterPeriod.LAST_THREE_MONTHS:
      return { endDate: now.utc().startOf('day'), startDate: now.utc().subtract(3, 'months').startOf('day') }
    case VigilanceArea.VigilanceAreaFilterPeriod.LAST_TWELVE_MONTHS:
      return { endDate: now.utc().startOf('day'), startDate: now.utc().subtract(12, 'months').startOf('day') }
    default:
      // case where the specific period is chosen but no date is provided
      return { endDate: undefined, startDate: undefined }
  }
}

function isMatchForSingleOccurrence(
  startDate: Dayjs,
  endDate: Dayjs,
  startDateFilter: Dayjs,
  endDateFilter: Dayjs
): boolean {
  return isWithinPeriod(endDate, startDate, startDateFilter, endDateFilter)
}

function isMatchForRecurringOccurrence(
  startDate: Dayjs,
  endDate: Dayjs,
  startDateFilter: Dayjs,
  endDateFilter: Dayjs,
  frequency: VigilanceArea.Frequency,
  loopStopDate: Dayjs
): boolean {
  let occurrenceStartDate = startDate
  let occurrenceEndDate = endDate

  while (occurrenceEndDate.isBefore(loopStopDate, 'day') || occurrenceEndDate.isSame(loopStopDate, 'day')) {
    if (isWithinPeriod(occurrenceEndDate, occurrenceStartDate, startDateFilter, endDateFilter)) {
      return true
    }

    switch (frequency) {
      case VigilanceArea.Frequency.ALL_WEEKS:
        occurrenceStartDate = occurrenceStartDate.add(7, 'day')
        occurrenceEndDate = occurrenceEndDate.add(7, 'day')
        break
      case VigilanceArea.Frequency.ALL_MONTHS:
        occurrenceStartDate = occurrenceStartDate.add(1, 'month')
        occurrenceEndDate = occurrenceEndDate.add(1, 'month')
        break
      case VigilanceArea.Frequency.ALL_YEARS:
        occurrenceStartDate = occurrenceStartDate.add(1, 'year')
        occurrenceEndDate = occurrenceEndDate.add(1, 'year')
        break
      default:
        return false
    }
  }

  return false
}

export const getFilterVigilanceAreasPerPeriod = (
  vigilanceAreas: (VigilanceArea.VigilanceAreaLayer | VigilanceArea.VigilanceAreaFromApi)[],
  periodFilter: VigilanceArea.VigilanceAreaFilterPeriod | undefined,
  vigilanceAreaSpecificPeriodFilter?: string[],
  vigilanceAreaTypeFilter?: VigilanceArea.VigilanceAreaFilterType[],
  isSuperUser: boolean = true
): VigilanceArea.VigilanceAreaLayer[] => {
  const { endDate: endDateFilter, startDate: startDateFilter } = calculatePeriodBounds(
    isSuperUser ? periodFilter : VigilanceArea.VigilanceAreaFilterPeriod.AT_THE_MOMENT,
    vigilanceAreaSpecificPeriodFilter
  )

  if (!endDateFilter || !startDateFilter) {
    return []
  }

  return Object.values((vigilanceAreas as Array<VigilanceArea.VigilanceAreaLayer>) ?? []).filter(vigilanceArea => {
    if (!isSuperUser && (vigilanceArea.isDraft || vigilanceArea.visibility === VigilanceArea.Visibility.PRIVATE)) {
      return false
    }
    if (!vigilanceArea) {
      return false
    }
    if (getFilterInformativeVigilanceArea(vigilanceAreaTypeFilter, vigilanceArea)) {
      return true
    }

    if (vigilanceArea.periods?.some(period => period.isAtAllTimes)) {
      return true
    }

    if (vigilanceArea.periods?.every(period => !period.startDatePeriod || !period.endDatePeriod)) {
      return false
    }

    return vigilanceArea.periods?.some(period => {
      const startDate = customDayjs(period.startDatePeriod).utc()
      const endDate = customDayjs(period.endDatePeriod).utc()

      // in case there is no end of recurrence (because endingCondition is NEVER) we set a default end date to the end of the period filter
      const loopStopDate = period.computedEndDate
        ? customDayjs(period.computedEndDate)
        : customDayjs(endDate).add(5, 'year')

      if (period.frequency === VigilanceArea.Frequency.NONE) {
        return isMatchForSingleOccurrence(startDate, endDate, startDateFilter, endDateFilter)
      }

      if (
        !!startDateFilter &&
        !!endDateFilter &&
        (startDateFilter?.isBetween(startDate, endDate) || endDateFilter.isBetween(startDate, endDate))
      ) {
        return true
      }

      if (period.frequency) {
        return isMatchForRecurringOccurrence(
          startDate,
          endDate,
          startDateFilter,
          endDateFilter,
          period.frequency,
          loopStopDate
        )
      }

      return false
    })
  })
}
