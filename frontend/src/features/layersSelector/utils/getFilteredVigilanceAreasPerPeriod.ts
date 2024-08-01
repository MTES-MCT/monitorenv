import { VigilanceArea } from '@features/VigilanceArea/types'
import { customDayjs } from '@mtes-mct/monitor-ui'
import isBetween from 'dayjs/plugin/isBetween'

customDayjs.extend(isBetween)

function isWithinPeriod(date, startDate, endDate) {
  return (date.isAfter(startDate) && date.isBefore(endDate)) || date.isSame(startDate) || date.isSame(endDate)
}

export const getFilterVigilanceAreasPerPeriod = (vigilanceAreas, periodFilter, vigilanceAreaSpecificPeriodFilter) => {
  const now = customDayjs()

  let startDateFilter
  let endDateFilter

  if (vigilanceAreaSpecificPeriodFilter) {
    startDateFilter = customDayjs(vigilanceAreaSpecificPeriodFilter[0])
    endDateFilter = customDayjs(vigilanceAreaSpecificPeriodFilter[1])
  } else {
    switch (periodFilter) {
      case VigilanceArea.VigilanceAreaFilterPeriod.AT_THE_MOMENT:
        startDateFilter = now.startOf('day')
        endDateFilter = now.endOf('day')
        break
      case VigilanceArea.VigilanceAreaFilterPeriod.CURRENT_QUARTER:
        startDateFilter = now.startOf('quarter')
        endDateFilter = now.endOf('quarter')
        break
      case VigilanceArea.VigilanceAreaFilterPeriod.CURRENT_YEAR:
        startDateFilter = now.startOf('year')
        endDateFilter = now.endOf('year')
        break
      case VigilanceArea.VigilanceAreaFilterPeriod.NEXT_THREE_MONTHS:
        startDateFilter = now.startOf('day')
        endDateFilter = now.add(3, 'months').endOf('day')
        break
      case VigilanceArea.VigilanceAreaFilterPeriod.SPECIFIC_PERIOD:
        break
      default:
        throw new Error('Invalid period')
    }
  }

  return Object.values(vigilanceAreas as Array<VigilanceArea.VigilanceArea>).filter(vigilanceArea => {
    if (!vigilanceArea) {
      return false
    }

    const startDate = customDayjs(vigilanceArea.startDatePeriod)
    const endDate = customDayjs(vigilanceArea.endDatePeriod)
    // in case there is no end of recurrence (because no recurrence) we set a default end date to the end of the period filter
    const computedEndDate = vigilanceArea.computedEndDate ? customDayjs(vigilanceArea.computedEndDate) : endDateFilter
    if (vigilanceArea.frequency === VigilanceArea.Frequency.NONE) {
      return (
        isWithinPeriod(startDate, startDateFilter, endDateFilter) ||
        isWithinPeriod(endDate, startDateFilter, endDateFilter)
      )
    }

    if (
      startDate &&
      endDate &&
      startDateFilter &&
      endDateFilter &&
      (startDateFilter.isBetween(startDate, endDate) || endDateFilter.isBetween(startDate, endDate))
    ) {
      return true
    }

    if (vigilanceArea.frequency) {
      let occurrenceDate = startDate

      while (occurrenceDate.isBefore(computedEndDate) || occurrenceDate.isSame(computedEndDate)) {
        if (isWithinPeriod(occurrenceDate, startDateFilter, endDateFilter)) {
          return true
        }
        switch (vigilanceArea.frequency) {
          case VigilanceArea.Frequency.ALL_WEEKS:
            occurrenceDate = occurrenceDate.add(7, 'days')
            break
          case VigilanceArea.Frequency.ALL_MONTHS:
            occurrenceDate = occurrenceDate.add(1, 'month')
            break
          case VigilanceArea.Frequency.ALL_YEARS:
            occurrenceDate = occurrenceDate.add(1, 'year')
            break
          default: // No recurrence
            return false
        }
      }
    }

    return false
  })
}
