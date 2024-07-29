import { VigilanceArea } from '@features/VigilanceArea/types'
import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import isBetween from 'dayjs/plugin/isBetween'
import quarterOfYear from 'dayjs/plugin/quarterOfYear'

// TODO 26/07/24 add this in monitor-ui
dayjs.extend(isBetween)
dayjs.extend(advancedFormat)
dayjs.extend(quarterOfYear)

function isWithinPeriod(date, startDate, endDate) {
  return (date.isAfter(startDate) && date.isBefore(endDate)) || date.isSame(startDate) || date.isSame(endDate)
}

export const getFilterVigilanceAreasPerPeriod = (areas, period) => {
  const now = dayjs()
  let startPeriod
  let endPeriod

  switch (period) {
    case VigilanceArea.VigilanceAreaFilterPeriod.AT_THE_MOMENT:
      startPeriod = now.startOf('day')
      endPeriod = now.endOf('day')
      break
    case VigilanceArea.VigilanceAreaFilterPeriod.CURRENT_QUARTER:
      startPeriod = now.startOf('quarter')
      endPeriod = now.endOf('quarter')
      break
    case VigilanceArea.VigilanceAreaFilterPeriod.CURRENT_YEAR:
      startPeriod = now.startOf('year')
      endPeriod = now.endOf('year')
      break
    case VigilanceArea.VigilanceAreaFilterPeriod.NEXT_THREE_MONTHS:
      startPeriod = now.startOf('day')
      endPeriod = now.add(3, 'months').endOf('day')
      break
    default:
      throw new Error('Invalid period')
  }

  return Object.values(areas as Array<VigilanceArea.VigilanceArea>).filter(area => {
    if (!area) {
      return false
    }

    const startDate = dayjs(area.startDatePeriod)
    // in case there is no end of recurrence we set a default end date in past
    const computedEndDate = dayjs(area.computedEndDate) ?? dayjs().add(1, 'years')

    if (area.frequency === VigilanceArea.Frequency.NONE) {
      return (
        isWithinPeriod(startDate, startPeriod, endPeriod) || isWithinPeriod(computedEndDate, startPeriod, endPeriod)
      )
    }

    if (area.frequency) {
      let occurrenceDate = startDate
      let diff: dayjs.OpUnitType = 'days'

      while (occurrenceDate.isBefore(computedEndDate) || occurrenceDate.isSame(computedEndDate)) {
        if (isWithinPeriod(occurrenceDate, startPeriod, endPeriod)) {
          return true
        }
        switch (area.frequency) {
          case VigilanceArea.Frequency.ALL_WEEKS:
            occurrenceDate = occurrenceDate.add(7, 'days')
            diff = 'weeks'
            break
          case VigilanceArea.Frequency.ALL_MONTHS:
            occurrenceDate = occurrenceDate.add(1, 'month')
            diff = 'months'
            break
          case VigilanceArea.Frequency.ALL_YEARS:
            occurrenceDate = occurrenceDate.add(1, 'year')
            diff = 'years'
            break
          default: // No recurrence
            diff = 'days'

            return false
        }

        if (
          area.endingCondition === VigilanceArea.EndingCondition.END_DATE &&
          area.endingOccurrenceDate &&
          occurrenceDate.isAfter(dayjs(area.endingOccurrenceDate))
        ) {
          break
        }

        if (
          area.endingCondition === VigilanceArea.EndingCondition.OCCURENCES_NUMBER &&
          area.endingOccurrencesNumber &&
          occurrenceDate.diff(startDate, diff) >= area.endingOccurrencesNumber
        ) {
          break
        }
      }
    }

    return false
  })
}
