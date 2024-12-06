import { VigilanceArea } from '@features/VigilanceArea/types'
import { customDayjs } from '@mtes-mct/monitor-ui'
import isBetween from 'dayjs/plugin/isBetween'

import type { Dayjs } from 'dayjs'

customDayjs.extend(isBetween)

function isWithinPeriod(date: Dayjs, startDate: Dayjs, endDate: Dayjs) {
  return (date.isAfter(startDate) && date.isBefore(endDate)) || date.isSame(startDate) || date.isSame(endDate)
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
  return (
    isWithinPeriod(startDate, startDateFilter, endDateFilter) ||
    isWithinPeriod(endDate, startDateFilter, endDateFilter) ||
    startDateFilter.isBetween(startDate, endDate) ||
    endDateFilter.isBetween(startDate, endDate)
  )
}

function isMatchForRecurringOccurrence(
  startDate: Dayjs,
  computedEndDate: Dayjs,
  startDateFilter: Dayjs,
  endDateFilter: Dayjs,
  frequency: VigilanceArea.Frequency
): boolean {
  let occurrenceDate = startDate

  while (occurrenceDate.isBefore(computedEndDate, 'day') || occurrenceDate.isSame(computedEndDate, 'day')) {
    if (isWithinPeriod(occurrenceDate, startDateFilter, endDateFilter)) {
      return true
    }
    switch (frequency) {
      case VigilanceArea.Frequency.ALL_WEEKS:
        occurrenceDate = occurrenceDate.add(7, 'day')
        break
      case VigilanceArea.Frequency.ALL_MONTHS:
        occurrenceDate = occurrenceDate.add(1, 'month')
        break
      case VigilanceArea.Frequency.ALL_YEARS:
        occurrenceDate = occurrenceDate.add(1, 'year')
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
  vigilanceAreaSpecificPeriodFilter?: string[]
): VigilanceArea.VigilanceAreaFromApi[] => {
  const { endDate: endDateFilter, startDate: startDateFilter } = calculatePeriodBounds(
    periodFilter,
    vigilanceAreaSpecificPeriodFilter
  )

  if (!endDateFilter || !startDateFilter) {
    return []
  }

  return Object.values((vigilanceAreas as Array<VigilanceArea.VigilanceAreaFromApi>) ?? []).filter(vigilanceArea => {
    if (vigilanceArea.isAtAllTimes) {
      return true
    }

    if (!vigilanceArea || !vigilanceArea.startDatePeriod || !vigilanceArea.endDatePeriod) {
      return false
    }

    const startDate = customDayjs(vigilanceArea.startDatePeriod).utc()
    const endDate = customDayjs(vigilanceArea.endDatePeriod).utc()

    // in case there is no end of recurrence (because endingCondition is NEVER) we set a default end date to the end of the period filter
    const computedEndDate = vigilanceArea.computedEndDate ? customDayjs(vigilanceArea.computedEndDate) : endDateFilter

    if (vigilanceArea.frequency === VigilanceArea.Frequency.NONE) {
      return isMatchForSingleOccurrence(startDate, endDate, startDateFilter, endDateFilter)
    }

    if (
      !!startDateFilter &&
      !!endDateFilter &&
      (startDateFilter?.isBetween(startDate, endDate) || endDateFilter.isBetween(startDate, endDate))
    ) {
      return true
    }

    if (vigilanceArea.frequency) {
      return isMatchForRecurringOccurrence(
        startDate,
        computedEndDate,
        startDateFilter,
        endDateFilter,
        vigilanceArea.frequency
      )
    }

    return false
  })
}
