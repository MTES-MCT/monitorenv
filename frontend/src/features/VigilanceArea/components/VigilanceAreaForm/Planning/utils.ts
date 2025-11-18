import { VigilanceArea } from '@features/VigilanceArea/types'
import { customDayjs } from '@mtes-mct/monitor-ui'

import EndingCondition = VigilanceArea.EndingCondition
import Frequency = VigilanceArea.Frequency

export const computeOccurenceWithinCurrentYear = (vigilanceArea: VigilanceArea.VigilanceArea) => {
  const endOfYear = customDayjs().utc().endOf('year')
  const endDate = customDayjs(vigilanceArea.endDatePeriod)
  if (vigilanceArea.isAtAllTimes) {
    return [{ end: endOfYear, start: customDayjs().utc().startOf('year') }]
  }
  if (!vigilanceArea?.startDatePeriod) {
    return []
  }
  switch (vigilanceArea?.frequency) {
    case Frequency.NONE:
      return [
        {
          end: customDayjs(vigilanceArea.endDatePeriod),
          start: customDayjs(vigilanceArea.startDatePeriod)
        }
      ]
    case Frequency.ALL_WEEKS:
      switch (vigilanceArea?.endingCondition) {
        case EndingCondition.NEVER:
          return [{ end: endOfYear, start: customDayjs().utc().startOf('year') }]
        case EndingCondition.END_DATE:
          return []
        case EndingCondition.OCCURENCES_NUMBER:
          return []
        default:
          return []
      }
    case Frequency.ALL_MONTHS:
      return [
        {
          end: customDayjs(vigilanceArea.endDatePeriod),
          start: customDayjs(vigilanceArea.startDatePeriod)
        }
      ]
    case Frequency.ALL_YEARS:
      switch (vigilanceArea?.endingCondition) {
        case EndingCondition.NEVER:
          return [
            {
              end: customDayjs(vigilanceArea.endDatePeriod),
              start: customDayjs(vigilanceArea.startDatePeriod)
            }
          ]
        case EndingCondition.END_DATE:
          if (endDate.isAfter(endOfYear)) {
            return [
              {
                end: endOfYear,
                start: customDayjs(vigilanceArea.startDatePeriod)
              }
            ]
          }

          return [
            {
              end: customDayjs(vigilanceArea.endDatePeriod),
              start: customDayjs(vigilanceArea.startDatePeriod)
            }
          ]
        case EndingCondition.OCCURENCES_NUMBER:
          return []
        default:
          return []
      }
    default:
      return []
  }
}
